'use strict';

angular.module('user', ['affiliation', 'ngMaterial','ngMessages', 'ngStorage','ngResource','pascalprecht.translate','person','toast'])

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
            }).error(function(data, status) {
                var wrongCreds = status === 401;
                $translate(wrongCreds ? ['ERROR', 'WRONG_EMAIL_OR_PASSWORD'] : ['ERROR']).then(function(translations) {
                    ToastService.showToast(translations.ERROR + ': ' + wrongCreds ? translations.WRONG_EMAIL_OR_PASSWORD : data.text, true);
                });
            });
        } else {
            $translate('EMAIL_PASSWORD_NOT_PROVIDED').then(function(translated) {
                ToastService.showToast(translated, true);
            });
        }
    };
});