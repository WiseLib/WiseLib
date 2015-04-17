'use strict';
var module = angular.module('person', ['proceeding', 'ngMaterial', 'ngMessages', 'affiliation', 'discipline']);

module.controller('personController', function($scope,$window, $routeParams, $translate, Page, Person, Affiliation, Discipline) {
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
		});
    }
	$scope.disciplines = [];
	Person.get({id: $routeParams.id}, function(person) {
		var person = person.persons[0];
		//console.log(person);
		$scope.person = person;
		var affiliationId = person.affiliation;
		$scope.person.affiliation='';
		getFullAffiliation(affiliationId);
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