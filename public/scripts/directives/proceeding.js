'use strict';
module = angular.module('proceeding', []);

module.directive('proceedingmin', function () {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        proceeding: '=proceeding'
    };

    directive.templateUrl = '../views/proceedingMin.html';
    return directive;
});