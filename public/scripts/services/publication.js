'use strict';

angular.module('publication', [])

.factory('Publication', function($resource) {
	return $resource('publications.json', {}, {
		query: { method: 'GET', isArray: true }
	});
});
