'use strict';
var module = angular.module('person', ['proceeding', 'ngMaterial', 'ngMessages', 'affiliation', 'discipline']);

module.controller('personController', function($scope, $routeParams, $translate, Page, Person, Affiliation, Discipline) {
	$translate('PERSON').then(function(translated) {
		Page.setTitle(translated);
	});

	function getFullAffiliation(id){
		Affiliation.get({id: id}, function(affiliation) {
			if(affiliation.parent !== undefined){
				$scope.person.affiliation += ' ' + affiliation.name + ' /';
				getFullAffiliation(affiliation.parent);
			}
			else $scope.person.affiliation += ' ' + affiliation.name;
		}, function(data) {
			$translate('ERROR').then(function(translated) {
				$scope.error = translated + ': ' + data.statusText;
			});
		});
	}
	$scope.disciplines = [];
	$scope.contacts = [];
	Person.get({id: $routeParams.id}, function(person) {
		$scope.person = person;
		var affiliationId = person.affiliation;
		$scope.person.affiliation='';
		getFullAffiliation(affiliationId);
		function searchDiscipline(id) {
			Discipline.get({id: id}, function(d) {
				$scope.disciplines.push(d.name);
			}, function(data) {
				$translate('ERROR').then(function(translated) {
					$scope.error = translated + ': ' + data.statusText;
				});
			});
		}

		person.disciplines.forEach(function(discipline) {searchDiscipline(discipline.id);});

		Person.contacts({id: person.id}, function(data) {
			$scope.contacts = data.persons;
		}, function(data) {
			$translate('ERROR').then(function(translated) {
				$scope.error = translated + ': ' + data.statusText;
			});
		});

	}, function() {
		$translate(['PERSON', 'WAS_NOT_FOUND_LC']).then(function(translations) {
			console.log(translations);
			$scope.error = translations.PERSON + ' ' + translations.WAS_NOT_FOUND_LC;
		});
	});

	Person.publications({id: $routeParams.id}, function(data) {
		$scope.publications = data.publications;
	}, function(data) {
		$translate('ERROR').then(function(translated) {
			$scope.error = translated + ': ' + data.statusText;
		});
	});
});