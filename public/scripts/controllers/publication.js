'use strict';
var module = angular.module('publication');

module.controller('publicationController', function($scope, $window, $routeParams, Page, Publication, Person) {
	Page.setTitle('Publication');
    $scope.publication = undefined;
    $scope.authors = [];

    Publication.get({id: $routeParams.id}, function(pub) {
		console.log(pub);
		$scope.publication = pub;
		for (var i = pub.authors.length - 1; i >= 0; i--) {
			Person.query(pub.authors[i], function(data) {
				console.log('Received persons: ' + JSON.stringify(data));
				$scope.authors.push(data.persons[0]);
			}, function(data) {
				console.log('error: ' + JSON.stringify(data));
			});
		}
    }, function(data) {
		console.log('Error getting publication: ' + JSON.stringify(data));
    });
});