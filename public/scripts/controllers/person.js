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
		});
    }
	$scope.disciplines = [];
	$scope.contacts = [];
	Person.get({id: $routeParams.id}, function(person) {
		console.log(person);
		$scope.person = person;
		var affiliationId = person.affiliation;
		$scope.person.affiliation='';
		getFullAffiliation(affiliationId);


	Person.contacts({id: person.id}, function(data) {
		$scope.contacts = data.persons;
	}, function(data) {
		$scope.error = data.error;
		console.log('error: ' + JSON.stringify(data.error));
	});

	}, function(data) {
		$scope.error = data.error;
		console.log('error: ' + JSON.stringify(data.error));
	});

	$scope.PubError = null; 
	Person.publications({id: $routeParams.id}, function(data) {
			$scope.publications = data.publications;
			if(data.publications.length == 0){
				 $translate('NO_PUBLICATIONS_FOUND').then(function(translated) {
                	$scope.PubError = translated;})
			}
		}, function(data) {
			$scope.error = data.error;
			console.log('got error: ' + JSON.stringify(data.error));
		});
});