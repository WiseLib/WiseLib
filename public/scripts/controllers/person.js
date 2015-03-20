'use strict';
var module = angular.module('person', ['communication', 'proceeding', 'ngMaterial']);

module.controller('personController', function ($scope,$window, $routeParams, Page, Person, Publication) {
	Page.setTitle('Person');
	Person.get({id: $routeParams.id}, function(person) {
		$scope.person = person;
		Publication.query({id: $routeParams.id}, function(data) {
			$scope.publications = data;
		}, function(data) {
			$scope.error = data.error;
			console.log('got error: ' + JSON.stringify(data.error));
		});
	}, function(data) {
		$scope.error = data.error;
		console.log('error: ' + JSON.stringify(data.error));
	});
});