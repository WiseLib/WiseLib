'use strict';

angular.module('user')

.controller('registerUserController', function($scope, $window, $location, $translate, $q, Page, $mdToast, AuthenticationService, User, Person, PersonState, Affiliation) {
    $translate('REGISTER').then(function(register) {
        Page.setTitle(register);
    });
    $scope.userForm = {};

    $scope.showSuccessMessage = function(message) {
        $mdToast.show({
            controller: 'ToastCtrl',
            templateUrl: '../views/feedback-toast.html',
            hideDelay: 6000,
            position: 'top right',
            locals: {text: message,
                     error: false}
        });
    };

    $scope.showErrorMessage = function(message) {
        $mdToast.show({
            controller: 'ToastCtrl',
            templateUrl: '../views/feedback-toast.html',
            hideDelay: 6000,
            position: 'top right',
            locals: {text: message,
                     error: true}
        });
    };

    $scope.authenticate = function(token) {
        AuthenticationService.isAuthenticated = true;
        $window.sessionStorage.token = token;
        $location.path('/restricted');
    };

    $scope.postPerson = function(person) {
        var deferred = $q.defer();
        if(person.id) {
            deferred.resolve(person);
        }
        else {
            Person.save(person, function(personData) {
                person.id = personData.id;
                deferred.resolve(person);
            }, function(errorData) {
                deferred.reject(errorData);
            });
        }

        return deferred.promise;
    };

    $scope.postUser = function(user) {
        var deferred = $q.defer();
        User.save(user, function(userData) {
            user.id = userData.id;
            deferred.resolve(user);
            $scope.authenticate(user.token);
        }, function(errorData) {
            deferred.reject(errorData);
        });

        return deferred.promise;
    };

    /**
   * Sends a request to the server to register a user using form input
   * @return {None}
   */
    $scope.createUser = function () {
        $scope.postPerson(PersonState.person)
        .then(function(person) {
            $scope.userForm.person = person.id;
            return $scope.postUser($scope.userForm);
        })
        .then(function(user) {
            return $translate('SUCCESSFULLY_REGISTERED');
        })
        .then(function(translation) {
            $scope.showSuccessMessage(translation);
        })
        .catch(function(errorData) {
            $scope.showErrorMessage(JSON.stringify(errorData));
        });
    };

});
