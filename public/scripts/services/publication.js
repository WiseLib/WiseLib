'use strict';
var publication = angular.module('publication');
publication.factory('Publication', function($resource) {
	return $resource('/users/:id/publications.json', {}, {
		query: { method: 'GET', isArray: false }
	});
});