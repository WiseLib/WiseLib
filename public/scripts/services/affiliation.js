'use strict';

angular.module('affiliation', [])
.factory('Affiliation', function($resource) {
	return $resource('/affiliations/:id.json', {id: '@id'}, {
		query: {method: 'GET', isArray: 'false', url: '/affiliations.json'}
	});
});