'use strict';

angular.module('person', [])

.factory('Person', function($resource) {
	return $resource('/persons.json', {}, {
		query: { method: 'GET', isArray: false }
	});
});
