'use strict';

angular.module('user')

.controller('loginUserController',function($scope, $location, UserService, AuthenticationService, $translate, Page, TokenService, ToastService) {
    Page.setTitleTranslationKey('LOG_IN');
    $scope.loginUserForm = {};

    /**
     * Send login request using form and save received token or show error.
     * @return {}
     */
    $scope.login = function() {
        if ($scope.loginUserForm.email !== '' && $scope.loginUserForm.password !== '') {
            UserService.logIn($scope.loginUserForm.email, $scope.loginUserForm.password)
            .success(function(data) {
                TokenService.setToken(data.token);
                AuthenticationService.isAuthenticated = true;
                $location.path('/');
                $translate('SUCCESSFULLY_LOGGED_IN').then(function(translated) {
                    ToastService.showToast(translated, false);
                });
            }).error(function(data) {
                $translate('ERROR').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.text, true);
                });
            });
        } else {
            $translate('EMAIL_PASSWORD_NOT_PROVIDED').then(function(translated) {
                ToastService.showToast(translated, true);
            });
        }
    };
});