'use strict';

angular.module('journal', [])

.factory('Journal', function($resource) {
	return $resource('/journals.json', {}, {
		query: { method: 'GET', isArray: false }
	});
});