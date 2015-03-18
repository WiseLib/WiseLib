'use strict';

angular.module('myPublications', [])

.controller('myPublicationsController', function($scope, $window, Page, Publication) {
    Page.setTitle('My publications');
    $scope.error = null;

    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));
    Publication.query({uploader: user.id}, function(data) {
        if(data.length > 0) {
            $scope.publications = data;
        } else {
            $scope.error = 'No publications found';
        }
    }, function(error) {
        console.warn('error:' + error);
        $scope.error = error.statusText;
    });

    // $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
    // 					   {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});
