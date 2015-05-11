'use strict';
var module = angular.module('publication', ['ngMaterial', 'ngAnimate', 'journal', 'user', 'proceeding', 'ngMessages']);

module.controller('publicationController', function($scope, $window, $routeParams, $translate, Page, Publication,UnknownPublication, Person, User, AuthenticationService, TokenService, ToastService) {
    $translate('PUBLICATION')
        .then(function(translated) {
            Page.setTitle(translated);
        });
    $scope.publication = undefined;
    $scope.persons = {};
    $scope.authors = [];
    $scope.editors = [];
    $scope.referencedPublications = [];
    $scope.referencedUnknownPublications=[];
    $scope.authenticatedUser = undefined;

    if (AuthenticationService.isAuthenticated) {
        var user = TokenService.getUser();
        $scope.authenticatedUser = user;
    }

    $scope.isInLibrary = function(publication) {
        var inLibrary = false;
        if($scope.authenticatedUser && publication) {
            $scope.authenticatedUser.library.forEach(function(libraryPublication) {
                inLibrary = inLibrary || libraryPublication.id === publication.id;
            });
        }
        return inLibrary;
    };

    $scope.addToLibrary = function(publication) {
        if (!$scope.isInLibrary()) {
            var userAddPublication = {
                id: $scope.authenticatedUser.id,
                library: $scope.authenticatedUser.library
            };
            userAddPublication.library.push({
                id: publication.id
            });
            User.put(userAddPublication, function(resource) {
                TokenService.setToken(resource.token);
                $scope.authenticatedUser = TokenService.getUser();
                $translate('ADDED_TO_LIBRARY').then(function(translated){ToastService.showToast(translated, false);});
            }, function(data) {
                $translate('ERROR').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.statusText, true);
                });
            });
        }
    };

    $scope.incrementSelectedIndex = function(i) {
        $scope.selectedIndex = $scope.selectedIndex + i;
    };

    Publication.get({id: $routeParams.id}, function(pub) {

        function getPerson(id) {
            Person.get({
                id: id
            }, function(person) {
                $scope.persons[id] = person;
            }, function(data) {
                console.log('error: ' + data.error);
            });
        }

        User.get({
            id: pub.uploader
        }, function(user) {
            $scope.uploaderPersonId = user.person;
            if (!$scope.persons[user.person]) {
                getPerson(user.person);
            }
        }, function(data) {
            $translate('ERROR').then(function(translated) {
                ToastService.showToast(translated + ': ' + data.statusText, true);
            });
        });
        $scope.publication = pub;

        pub.authors.forEach(function(author) {
            var id = author.id;
            $scope.authors.push(id);
            if (!$scope.persons[id]) {
                getPerson(id);
            }
        });

        if(pub.editors !== undefined){
            pub.editors.forEach(function(editor) {
                var id = editor.id;
                $scope.editors.push(id);
                if(!$scope.persons[id]) {
                    getPerson(id);
                }
            });
        }
        
        function getPublication(id) {
            Publication.get({id: id}, function(publication) {
                $scope.referencedPublications.push(publication);
            }, function(data) {
                $translate('ERROR').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.statusText, true);
                });
            });
        }
        if(pub.references !== undefined){
            pub.references.forEach(function(publication) {
                getPublication(publication.id);
            });
        }

        if(pub.unknownReferences !== undefined){
            for (var i = 0; i < pub.unknownReferences.length; i++) {
                var unknown = pub.unknownReferences[i].id;
                UnknownPublication.get({id:unknown},function(unknownpub){
                    $scope.referencedUnknownPublications.push(unknownpub.publications[0]);
                },function(){})
            };
        }
    }, function() {
        $translate(['PUBLICATION', 'WAS_NOT_FOUND_LC']).then(function(translations) {
            $scope.error = translations.PUBLICATION + ' ' + translations.WAS_NOT_FOUND_LC;
        });
    });

});
