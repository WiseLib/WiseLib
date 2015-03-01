'use strict';

angular.module('publication')

.directive('publicationmin', function () {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        publication: '=publication'
    };

    directive.templateUrl = '../views/publicationMin.html';
    return directive;
});
