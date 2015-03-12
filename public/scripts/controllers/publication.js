'use strict';
var module = angular.module('publicationCtrlr', []);

module.controller('publicationController', function ($scope, $window, $routeParams) {
    $scope.userId = $routeParams.userId;
    $scope.pubId = $routeParams.pubId;
console.log($routeParams);
});