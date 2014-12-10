var addUser = angular.module('addUser', []);

addUser.controller('manageUserController', function($scope, $http) {
  'use strict';
  $scope.userForm = {};
  $scope.persons = [];
  $scope.userForm.radioChecked = false;

  //feedback after clicking the submit button
  $scope.successMessage = '';
  $scope.errorMessage = '';

  $scope.$watch('userForm.firstName', function() {$scope.searchPersons();});
  $scope.$watch('userForm.lastName', function() {$scope.searchPersons();});

  /**
   * Sends a request (if necessary) to the server to search for a person
   * @return {None}
   */
  $scope.searchPersons = function() {
    $scope.userForm.radioChecked = false; //Deselect radio button
    $scope.persons = []; //Reset found persons list
    if(!$scope.userForm.firstName || !$scope.userForm.lastName || $scope.userForm.firstName.length < 3 || $scope.userForm.lastName.length < 3) {return;} //Don't search if first or last name is too short
    $http.post('/api/person/search.json', {'firstName': $scope.userForm.firstName, 'lastName': $scope.userForm.lastName})
      .success(function (data) {
        console.log('received ' + JSON.stringify(data));
        $scope.persons = data;
      });
  };

/**
 * Sends a request to the server to register a user using form input
 * @return {None}
 */
  $scope.createUser = function() {
    $http.post('/api/person', $scope.userForm)
    .success(function (data) {
      $scope.successMessage = 'User succesfully added';
    })
    .error(function (data) {
      $scope.errorMessage = 'Error: ' + data;
    });
  };

});