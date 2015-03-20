'use strict';

angular.module('user', ['ngMessages'])

.controller('loginUserController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'Page', '$mdToast',
   function($scope, $location, $window, UserService, AuthenticationService, Page, $mdToast) {
    Page.setTitle('Log in');
    $scope.loginUserForm = {};

    /**
     * Send login request using form and save received token or show error.
     * @return {}
     */
    $scope.login = function() {
        if ($scope.loginUserForm.email !== '' && $scope.loginUserForm.password !== '') {
            console.log('email and password provided, trying to log in...');
            UserService.logIn($scope.loginUserForm.email, $scope.loginUserForm.password)
            .success(function(data) {
                AuthenticationService.isAuthenticated = true;
                $window.sessionStorage.token = data.token;
                $location.path('/restricted');
                $mdToast.show({
                    controller: 'ToastCtrl',
                    templateUrl: '../views/feedback-toast.html',
                    hideDelay: 6000,
                    position: 'top right',
                    locals: {text: 'Logged in successfully',
                        error: false}
                });
            }).error(function(data) {
                $mdToast.show({
                    controller: 'ToastCtrl',
                    templateUrl: '../views/feedback-toast.html',
                    hideDelay: 6000,
                    position: 'top right',
                    locals: {text: 'Error: ' + data.error,
                        error: true}
                });
            });
        } else {
            // email and/or password not filled in: ignore
        }
    };
}]);