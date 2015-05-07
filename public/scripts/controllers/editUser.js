'use strict';

angular.module('user')

.controller('updateUserController', function($scope, $location, $translate, Page, AuthenticationService, User, Person, TokenService, ToastService) {
    $translate('UPDATE_PROFILE').then(function(translated) {
    Page.setTitle(translated);
  });
    $scope.userEditForm = {};
    $scope.personEditForm = {};

    if(!TokenService.getToken()) {
        $translate('LOGGED_IN_VIEW_REQUIREMENT').then(function(translated) {
            $scope.error = translated;
        });
        return;
    }

    /**
   * Sends a request to the server to register a user using form input
   * @return {None}
   */
    $scope.update = function (service, json) {
        service.put(json,
        function() { //Success
            $translate('SAVED_CHANGES').then(function(translated) {
                ToastService.showToast(translated, false);
            });
        },
        function(data) { //Error
            $translate('ERROR').then(function(translated) {
                ToastService.showToast(translated + ': ' + data.statusText, true);
            });
        });
    };

    function filterEmpty(obj) {
        for(var key in obj) {
            if(!obj[key]) {
                delete obj[key];
            }
        }
        return obj;
    }

    $scope.updateUser = function() {
        var user = TokenService.getUser();
        $scope.userEditForm.id = user.id;
        $scope.update(User, filterEmpty($scope.userEditForm));
    };
    $scope.updatePerson = function() {
        var user = TokenService.getUser();
        $scope.personEditForm.id = user.person;
        $scope.update(Person, filterEmpty($scope.personEditForm));
    };
});
