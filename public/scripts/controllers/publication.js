'use strict';
var module = angular.module('publication');

module.controller('publicationController', function($scope, $window, $routeParams, Page, Publication, Person) {
	Page.setTitle('Publication');
    $scope.publication = undefined;
    $scope.authors = [];

    Publication.get({id: $routeParams.id}, function(pub) {
		console.log(pub);
		$scope.publication = pub;
    }, function(data) {
		console.log('Error getting publication: ' + JSON.stringify(data));
    });
});