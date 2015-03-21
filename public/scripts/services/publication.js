'use strict';

angular.module('publication', [])

.factory('Publication', function($resource) {
	return $resource('/persons/:id/publications.json', {id:'@id'}, {
		query: { method: 'GET', isArray: false }
	});
});
