'use strict';

angular.module('person')
.factory('Person', function($resource) {
	return $resource('/persons.json', {}, {
		query: { method: 'GET', isArray: false},
		put: {method: 'PUT'},
		publications: {method: 'GET', url:'/persons/:id/publications.json'}
	});
})
.service('PersonState', function() {
	this.person = {};
});
