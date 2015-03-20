'use strict';

angular.module('person')

.factory('Person', function($resource) {
	return $resource('/persons/:id.json', {}, {
		query: { method: 'GET', isArray: false , url: '/persons.json'},
		put: {method: 'PUT'},
		publications: {method: 'GET', isArray: true, url:'/persons/:id/publications.json'}
	});
});
