'use strict';

angular.module('publication', [])

.factory('Publication', function($resource) {
	return $resource('/users/:id/publications.json', {}, {
		query: { method: 'GET', isArray: false }
	});
})

.factory('SearchPublication', function($resource) {
	return $resource('/publications.json/?q=:q',{q:'@q'});
});
