'use strict';

angular.module('journal', [])

.factory('Journal', function($resource) {
	return $resource('/journals.json', {}, {
		query: { method: 'GET', isArray: false },
		search: { method: 'GET', url:'/journals.json/?q=:q@name',params: {q:'@q'}},
	});
})

.factory('Proceeding', function($resource) {
	return $resource('/proceedings.json', {}, {
		query: { method: 'GET', isArray: false },
		search: { method: 'GET', url:'/proceedings.json/?q=:q@name',params: {q:'@q'}},
	});
});