'use strict';
module = angular.module('person');

module.directive('personmin', function () {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        person: '=person'
    };

    directive.templateUrl = '../views/personMin.html';
    return directive;
});