'use strict';
var module = angular.module('personCtrlr', ['communication', 'proceeding', 'ngMaterial']);

module.controller('personController', function ($scope,$window, $routeParams, Page, Person, Publication) {
	Page.setTitle('Person');
	Person.query({id: $routeParams.id}, function(data) {
		$scope.person = data.persons[0];
		Publication.query({authors: [$scope.person.id]}, function(data) {
			console.log(data);
			$scope.publications = data;
		}, function(data) {
			console.log('got error: ' + JSON.stringify(data.error));
		});
	}, function(data) {
		console.log('error: ' + JSON.stringify(data.error));
	});

	//TODO: publications of person zoeken

});