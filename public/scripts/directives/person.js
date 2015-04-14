'use strict';

angular.module('person')

.directive('personmin', function () {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        person: '=person'
    };

    directive.templateUrl = '../views/personMin.html';
    return directive;
})

.directive('addperson', function() {
	return {
		restrict: 'E',
		templateUrl: '../views/addPerson.html'
	};
});
