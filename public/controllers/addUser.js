var addUser = angular.module('addUser', []);

addUser.controller('manageUserController', function ($scope, $http, Page) {
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
            $scope.successMessage = 'User succesfully added';
        })
        .error(function (data) {
            $scope.errorMessage = 'Error: ' + data;
        });
    };

});
