'use strict';

angular.module('user')

.controller('registerUserController', function($scope, $http, $window, $location, Page, $mdToast, $animate, AuthenticationService, User, Person, Affiliation) {
    Page.setTitle('Register');
    $scope.userForm = {};
    $scope.persons = [];
    $scope.userForm.profileImageSrc = '';
    $scope.affiliations = [];
    $scope.affiliationsParent = '';

    //feedback after clicking the submit button
    $scope.successMessage = '';
    $scope.errorMessage = '';

    $scope.$watch('userForm.firstName', function () {$scope.searchPersons(); });
    $scope.$watch('userForm.lastName', function () {$scope.searchPersons(); });
    $scope.$watch('selectedAffiliation', function() {$scope.addAffiliation($scope.selectedAffiliation)});

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

    $scope.searchAffiliations = function(id) {
        Affiliation.query({parent: id}, function(data) {
            $scope.choiceAffiliations = data.affiliations;
        }, function(error) {console.log('error! ' + error); });
    };
    $scope.filterAffiliations = function(name) {
        var aff = $scope.choiceAffiliations;
        var filtered = [];
        for(var i in aff) {
            if(aff[i].name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
                filtered.push(aff[i]);
            }
        }
        return filtered;
    };
    $scope.postAffiliation = function(name) {
        var toPost = {};
        toPost.name = name;
        if($scope.affiliationsParent != '') {
            toPost.parent = $scope.affiliationsParent;
        }
        Affiliation.save(toPost, function(data) {
            toPost.id = data.id;
            console.log('posted :' + JSON.stringify(toPost));
            $scope.addAffiliation(toPost);
        }, function(data) {
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
    $scope.addAffiliation = function(toAdd) {
        if(toAdd !== undefined) {
            $scope.affiliations.push(toAdd);
            $scope.userForm.affiliation = toAdd.id;
            $scope.affiliationsParent = toAdd.id;
            $scope.affiliationName = '';
        }
        $scope.searchAffiliations($scope.affiliationsParent);
    };
    $scope.popAffiliation = function() {
        var popped = $scope.affiliations.pop();
        if(popped === undefined || $scope.affiliations.length === 0) {
            $scope.affiliationsParent = '';
        }
        else {
            $scope.affiliationsParent = popped.parent;
        }
        $scope.affiliationName = '';
        $scope.selectedAffiliation = undefined;
        $scope.searchAffiliations($scope.affiliationsParent);
    };

});
