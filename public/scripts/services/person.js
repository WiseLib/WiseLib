'use strict';

angular.module('person', [])

.factory('Person', function($resource) {
	return $resource('/persons.json', {}, {
		query: { method: 'GET', isArray: false },
		put: {method: 'PUT'}
	});
})

.factory('PersonById',function($resource){
	return $resource('/persons/:id.json',{id:'@id'}, {
		get: { method: 'GET', isArray: false }
	});
})
