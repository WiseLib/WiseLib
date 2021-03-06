'use strict';

angular.module('person')

.controller('addPersonController', function($scope, Person, PersonState, Affiliation, $translate, ToastService) {
    $scope.person = PersonState.person;
    $scope.persons = [];
    $scope.person.profileImageSrc = '';
    $scope.affiliations = [];
    $scope.affiliationsParent = '';

    //feedback after clicking the submit button
    $scope.successMessage = '';
    $scope.errorMessage = '';

    $scope.$watch('person.firstName', function () {
        $scope.searchPersons($scope.person.firstName, $scope.person.lastName);
    });
    $scope.$watch('person.lastName', function () {
        $scope.searchPersons($scope.person.firstName, $scope.person.lastName);
    });
    $scope.$watch('selectedAffiliation', function() {$scope.addAffiliation($scope.selectedAffiliation);});

    /**
    * Load image to show preview of profile image to upload and use
    * @param {object} element element which caused the change
    * @return {None}
    */
    $scope.fileNameChanged = function(element) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.$apply(function() {
                $scope.person.profileImageSrc = e.target.result;
            });
        };
        reader.readAsDataURL(element.files[0]);
    };

    /**
     * Sends a request (if necessary) to the server to search for a person
     * @return {None}
     */
    $scope.searchPersons = function(firstName, lastName) {
        $scope.person.id = undefined;
        $scope.persons = []; //Reset found persons list
        //Don't search if first or last name is too short
        if (!firstName ||
            !lastName ||
            firstName.length < 3 ||
            lastName.length < 3) {
            return;
        }
        Person.query({firstName: firstName, lastName: lastName}, function(data) {
            $scope.persons = data.persons;
        }, function(data) {ToastService.showToast(data.statusText,true); });
    };

    $scope.searchAffiliations = function(id) {
        Affiliation.query({parent: id}, function(data) {
            $scope.choiceAffiliations = data.affiliations;
        }, function(data) {ToastService.showToast(data.statusText,true);});
    };
    $scope.filterAffiliations = function(name) {
        var affs = $scope.choiceAffiliations;
        var filtered = [];
        affs.forEach(function(aff) {
            if(aff.name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
                filtered.push(aff);
            }
        });
        return filtered;
    };
    $scope.postAffiliation = function(name) {
        var toPost = {};
        toPost.name = name;
        if($scope.affiliationsParent !== '') {
            toPost.parent = $scope.affiliationsParent;
        }
        Affiliation.save(toPost, function(data) {
            toPost.id = data.id;
            $scope.addAffiliation(toPost);
        }, function(data) {
            $translate('ERROR').then(function(translated) {
                ToastService.showToast(translated + ': ' + data.statusText, true);
            });
        });
    };
    $scope.addAffiliation = function(toAdd) {
        if(toAdd) {
            $scope.affiliations.push(toAdd);
            $scope.person.affiliation = toAdd.id;
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
