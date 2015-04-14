'use strict';

angular.module('user')

.controller('registerUserController', function($scope, $window, $location, Page, $mdToast, AuthenticationService, User, Person, PersonState, Affiliation) {
    Page.setTitle('Register');
    $scope.userForm = {};

    //feedback after clicking the submit button
    $scope.successMessage = '';
    $scope.errorMessage = '';

    /**
   * Sends a request to the server to register a user using form input
   * @return {None}
   */
    $scope.createUser = function () {
        $scope.userForm.person = PersonState.person.id;
        console.log(JSON.stringify($scope.userForm));
        var newUser = new User($scope.userForm);
        newUser.$save(function(data) { //Success
            console.log('logged in!');
            AuthenticationService.isAuthenticated = true;
            $window.sessionStorage.token = data.token;
            $location.path('/restricted');
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Succesfully registered',
                         error: false}
            });
        }, function(data) { //Error
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Error: ' + data.error,
                         error: true}
            });
        });
    };

});
