'use strict';

angular.module('user')

.controller('registerUserController', function($scope, $location, $translate, $q, Page, AuthenticationService, User, Person, PersonState, Affiliation, TokenService, ToastService) {
    $translate('REGISTER').then(function(register) {
        Page.setTitle(register);
    });
    $scope.userForm = {};

    $scope.authenticate = function(token) {
        TokenService.setToken(token);
        AuthenticationService.isAuthenticated = true;
        $location.path('/');
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
        .then(function() {
            return $translate('SUCCESSFULLY_REGISTERED');
        })
        .then(function(translation) {
            ToastService.showToast(translation, false);
            PersonState.person={};
        })
        .catch(function(data) {
            ToastService.showToast(JSON.stringify(data.statusText), true);
        });
    };

});
