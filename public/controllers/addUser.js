var addUser = angular.module('addUser', []);

addUser.controller('manageUserController', function ($scope, $http, $window, Page, $mdToast, $animate, AuthenticationService) {
    'use strict';
    Page.setTitle('Register');
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
        }
        reader.readAsDataURL(element.files[0]);
    }

    /**
     * Sends a request (if necessary) to the server to search for a person
     * @return {None}
     */
    $scope.searchPersons = function() {
        $scope.userForm.personId = undefined;
        $scope.persons = []; //Reset found persons list
        if (!$scope.userForm.firstName || !$scope.userForm.lastName || $scope.userForm.firstName.length < 3 || $scope.userForm.lastName.length < 3) {return; } //Don't search if first or last name is too short
        $http.get('/persons.json' + '?firstName=' + $scope.userForm.firstName + '&lastName=' + $scope.userForm.lastName)
        .then(function (response) {
            console.log('received ' + JSON.stringify(response.data.persons));
            $scope.persons = response.data.persons;
        });
    };

    /**
   * Sends a request to the server to register a user using form input
   * @return {None}
   */
    $scope.createUser = function () {
        $http.post('user.json', $scope.userForm)
        .success(function(data) {
            AuthenticationService.isAuthenticated = true;
            $window.sessionStorage.token = data.token;
            $location.path("/restricted");
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Succesfully registered',
                         error: false}
            });
        })
        .error(function (data) {
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Error: ' + data,
                         error: true}
            });
        });
    };

});
