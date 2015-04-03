'use strict';

angular.module('person',[])
.factory('Person', function($resource) {
	return $resource('/persons/:id.json', {id:'@id'}, {
		query: { method: 'GET', isArray: false , url: '/persons.json'},
		put: {method: 'PUT'},
		publications: {method: 'GET', isArray: false, url:'/persons/:id/publications.json'}
	});
})

.factory('PersonById',function($resource){
	return $resource('/persons/:id.json',{id:'@id'}, {
		get: { method: 'GET', isArray: false }
	});
})
