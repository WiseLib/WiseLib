var loginUser = angular.module('loginUser', []);
loginUser.controller('loginUserController', function ($scope, $http) {
    'use strict';
    $scope.email = '';
    $scope.password = '';

    $scope.loginUser = function() {
    	if ($scope.email !== null && $scope.password !== null) {
    }