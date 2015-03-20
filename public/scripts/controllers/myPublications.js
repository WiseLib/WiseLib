'use strict';

angular.module('publication')

.controller('myPublicationsController', function($scope, $window, Page, Publication, Person) {
    Page.setTitle('My publications');
    $scope.error = null;

    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));
    Person.publications({id: user.personId.id}, function(data) {
        console.log('got data!');
        console.log(data);
        if(data.publications.length > 0) {
            for (var i = data.publications.length - 1; i >= 0; i--) {
                data.publications[i].link = '/publications/' + data.publications[i].id;
            }
            $scope.publications = data.publications;
        } else {
            $scope.error = 'No publications found';
        }
    }, function(error) {
        console.warn('error:' + error);
        $scope.error = error.statusText;
    });

    // $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
    //                      {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});
