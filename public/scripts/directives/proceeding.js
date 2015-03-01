'use strict';

angular.module('proceeding', [])

.directive('proceedingmin', function () {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        proceeding: '=proceeding'
    };

    directive.templateUrl = '../views/proceedingMin.html';
    return directive;
});
