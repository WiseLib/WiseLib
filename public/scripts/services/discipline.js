'use strict';

var module = angular.module('discipline', []);

module.factory('Discipline', function($resource) {
	return $resource('/disciplines/:id.json', {id: '@id'}, {
		query: { method: 'GET', isArray: false , url: '/disciplines.json'}
	});
});

module.factory('fetchDisciplines', ['Discipline', function(Discipline) {
	var params;
	var found;
	var fetch = function(options) {
		if(params !== JSON.stringify(options)) {
			params = JSON.stringify(options);
			var res = function(data) {
				found = data.disciplines;
			};
			var err = function(error) {
				console.log('error! ' + error);
			};
			Discipline.query(options, res, err);
		}
		return found;
	};

	return fetch;
}]);