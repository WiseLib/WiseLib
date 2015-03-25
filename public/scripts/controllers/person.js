'use strict';
var module = angular.module('person', ['communication', 'proceeding', 'ngMaterial', 'affiliation', 'discipline']);

module.controller('personController', function ($scope,$window, $routeParams, Page, Person, Affiliation, Discipline) {
	Page.setTitle('Person');
	$scope.disciplines = [];
	Person.get({id: $routeParams.id}, function(person) {
		console.log(person);
		$scope.person = person;
		Affiliation.get({id: person.affiliation}, function(affiliation) {
			$scope.person.affiliation = affiliation.name;
		});
		function searchDiscipline(id) {
			Discipline.get({id: id}, function(d) {
				$scope.disciplines.push(d.name);
			}, function(data) {
				console.log('error: ' + data.error);
			});
		}

		for(var i in person.disciplines) searchDiscipline(person.disciplines[i].id);

	}, function(data) {
		$scope.error = data.error;
		console.log('error: ' + JSON.stringify(data.error));
	});

	Person.publications({id: $routeParams.id}, function(data) {
			$scope.publications = data.publications;
		}, function(data) {
			$scope.error = data.error;
			console.log('got error: ' + JSON.stringify(data.error));
		});
});