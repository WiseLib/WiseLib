'use strict';

angular.module('myPublications', [])

.controller('myPublicationsController', function($scope, $window, Page, Publication) {
    Page.setTitle('My publications');
    $scope.error = null;

    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));
    Publication.query({id: user.id}, function(data) {
        console.log('got data!');
        console.log(data);
        if(data.publications.length > 0) {
            for (var i = data.publications.length - 1; i >= 0; i--) {
                data.publications[i].link = '/users/' + user.id + '/publications/' + data.publications[i].id;
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
