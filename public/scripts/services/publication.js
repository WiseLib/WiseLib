'use strict';

angular.module('publication', [])

.factory('Publication', function($resource) {
	return $resource('/users/:userId/publications/:pubId.json', {}, {
		query: { method: 'GET', isArray: false, url: 'users/:id/publications.json' }
	});
});
