'use strict';

angular.module('publication')

.factory('Publication', function($resource) {
	return $resource('/persons/:id/publications.json', {}, {
		query: { method: 'GET', isArray: true }
	});
});
