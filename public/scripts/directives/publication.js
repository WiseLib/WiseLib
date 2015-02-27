'use strict';
module = angular.module('publication');

module.directive('publicationmin', function () {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        publication: '=publication'
    };

    directive.templateUrl = '../views/publicationMin.html';
    return directive;
});