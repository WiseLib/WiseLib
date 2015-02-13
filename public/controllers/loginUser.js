var loginUser = angular.module('loginUser', ['ngMessages']);
loginUser.controller('loginUserController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'Page',
    function($scope, $location, $window, UserService, AuthenticationService, Page) {
	'use strict';
	Page.setTitle('Log in');
	$scope.loginUserForm = {};

	$scope.login = function() {
		if ($scope.loginUserForm.email !== '' && $scope.loginUserForm.password !== '') {
			console.log('email and password provided, trying to log in...');
			UserService.logIn($scope.loginUserForm.email, $scope.loginUserForm.password).success(function(data) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/restricted");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
		} else {
			console.log('damn');
		}
	};
}]);
