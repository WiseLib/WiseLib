'use strict';

angular.module('myPublications', [])

.controller('myPublicationsController', function($scope, $window, Page, Publication) {
    Page.setTitle('My publications');
    $scope.error = null;

    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));

    var pub = new Publication({id:user});
    pub.$query(function(data) {
        console.log('got data!');
        console.log(data);
        if(data.publications.length > 0) {
            $scope.publications = data.publications;
        } else {
            $scope.error = 'No publications found';
        }
    }, function(error) {
        $scope.error = error.status + ' ' +error.statusText;
    });

    // $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
    // 					   {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});
