'use strict';

angular.module('user')

.controller('registerUserController', function($scope, $http, $window, $location, $translate, Page, $mdToast, $animate, AuthenticationService, User, Person) {
    $translate('REGISTER').then(function(register) {
    Page.setTitle(register);
  });
    $scope.userForm = {};
    $scope.persons = [];
    $scope.userForm.profileImageSrc = '';

    //feedback after clicking the submit button
    $scope.successMessage = '';
    $scope.errorMessage = '';

    $scope.$watch('userForm.firstName', function () {$scope.searchPersons(); });
    $scope.$watch('userForm.lastName', function () {$scope.searchPersons(); });

    /**
    * Load image to show preview of profile image to upload and use
    * @param {object} element element which caused the change
    * @return {None}
    */
    $scope.fileNameChanged = function(element) {
        console.log('filename changed');
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log('image loaded');
            $scope.$apply(function() {
                $scope.userForm.profileImageSrc = e.target.result;
            });
        };
        reader.readAsDataURL(element.files[0]);
    };

    /**
     * Sends a request (if necessary) to the server to search for a person
     * @return {None}
     */
    $scope.searchPersons = function() {
        $scope.userForm.personId = undefined;
        $scope.persons = []; //Reset found persons list
        if (!$scope.userForm.firstName || !$scope.userForm.lastName || $scope.userForm.firstName.length < 3 || $scope.userForm.lastName.length < 3) {return; } //Don't search if first or last name is too short
        Person.query({firstName: $scope.userForm.firstName, lastName: $scope.userForm.lastName}, function(data) {
            $scope.persons = data.persons;
        }, function(error) {console.log('error! ' + error); });
    };

    /**
   * Sends a request to the server to register a user using form input
   * @return {None}
   */
    $scope.createUser = function () {
        console.log(User);
        var newUser = new User($scope.userForm);
        newUser.$save(function(data) { //Success
            console.log('logged in!');
            AuthenticationService.isAuthenticated = true;
            $window.sessionStorage.token = data.token;
            $location.path('/restricted');
            $translate('SUCCESSFULLY_REGISTERED').then(function(translated) {
                $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: translated,
                         error: false}
                });
            });
        }, function(data) { //Error
            $translate('SUCCESSFULLY_REGISTERED').then(function(translated) {
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
    };

});
