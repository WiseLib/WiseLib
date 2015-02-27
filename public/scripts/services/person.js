'use strict';
var person = angular.module('person', []);
person.factory('Person', function($resource) {
	return $resource('/persons.json', {}, {
		query: { method: 'GET', isArray: false }
	});
});