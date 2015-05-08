'use strict';

angular.module('person')
.factory('Person', function($resource) {
	return $resource('/persons/:id.json', {id:'@id'}, {
		query: { method: 'GET', isArray: false , url: '/persons.json'},
		put: {method: 'PUT'},
		publications: {method: 'GET', url:'/persons/:id/publications.json'},
		contacts: {method: 'GET', url: '/persons/:id/contacts.json'},
		network: {method: 'GET', url: '/persons/:id/network.json'}
	});
})
.service('PersonState', function() {
	this.person = {};
});
