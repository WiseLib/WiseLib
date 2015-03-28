'use strict';

angular.module('publication')

.factory('Publication', function($resource) {
	return $resource('/publications/:id.json', {}, {
		query: { method: 'GET', isArray: false , url:'/publications.json'}
	});
});
