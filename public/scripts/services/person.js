'use strict';

angular.module('person')
.factory('Person', function($resource) {
	return $resource('/persons/:id.json', {id:'@id'}, {
		query: { method: 'GET', isArray: false , url: '/persons.json'},
		put: {method: 'PUT'},
		publications: {method: 'GET', url:'/persons/:id/publications.json'},
		searchFirstName: { method: 'GET', url:'/persons.json/?firstName=:fn',params: {fn:'@fn'}},
		searchLastName: { method: 'GET', url:'/persons.json/?lastName=:ln',params: {ln:'@ln'}},
		searchBoth: { method: 'GET', url:'/persons.json/?firstName=:fn&lastName=:ln',params: {fn:'@fn',ln:'@ln'}}
	});
})

