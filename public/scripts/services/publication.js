'use strict';

angular.module('publication', [])

.factory('Publication', function($resource) {
	return $resource('/persons/:id/publications.json', {id:'@id'}, {
		query: { method: 'GET', isArray: false }
	});
})

.factory('SearchPublication', function($resource) {
	return $resource('/publications.json/?q=:q',{q:'@q'});
});
