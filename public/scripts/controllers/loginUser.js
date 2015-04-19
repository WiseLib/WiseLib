'use strict';

angular.module('user')

.controller('loginUserController',function($scope, $location, $window, UserService, AuthenticationService, $translate, Page, $mdToast) {
    $translate('LOG_IN').then(function(translated) {
    Page.setTitle(translated);
  });
    $scope.loginUserForm = {};

    /**
     * Send login request using form and save received token or show error.
     * @return {}
     */
    $scope.login = function() {
        if ($scope.loginUserForm.email !== '' && $scope.loginUserForm.password !== '') {
            //console.log('email and password provided, trying to log in...');
            UserService.logIn($scope.loginUserForm.email, $scope.loginUserForm.password)
            .success(function(data) {
                AuthenticationService.isAuthenticated = true;
                $window.sessionStorage.token = data.token;
                $location.path('/');
                $translate('SUCCESSFULLY_LOGGED_IN').then(function(translated) {
                    $mdToast.show({
                        controller: 'ToastCtrl',
                        templateUrl: '../views/feedback-toast.html',
                        hideDelay: 6000,
                        position: 'top right',
                        locals: {text: translated,
                            error: false}
                    });
                });
            }).error(function(data) {
                $translate('ERROR').then(function(translated) {
                    $mdToast.show({
                        controller: 'ToastCtrl',
                        templateUrl: '../views/feedback-toast.html',
                        hideDelay: 6000,
                        position: 'top right',
                        locals: {text: translated + ': ' + data.error,
                            error: true}
                    });
                });
            });
        } else {
            $translate('EMAIL_PASSWORD_NOT_PROVIDED').then(function(translated) {
                $mdToast.show({
                        controller: 'ToastCtrl',
                        templateUrl: '../views/feedback-toast.html',
                        hideDelay: 6000,
                        position: 'top right',
                        locals: {text: translated,
                            error: true}
                    });
            });
        }
    };
});