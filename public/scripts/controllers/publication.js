'use strict';
var module = angular.module('publication', ['ngMaterial', 'ngAnimate', 'journal', 'user', 'proceeding', 'ngMessages']);

module.controller('publicationController', function($scope, $window, $routeParams, $translate, Page, Publication, Person, User, AuthenticationService, TokenService,ToastService) {
    $translate('PUBLICATION').then(function(translated) {
        Page.setTitle(translated);
    });
    $scope.publication = undefined;
    $scope.persons = {};
    $scope.authors = [];
    $scope.editors = [];
    $scope.publications = [];
    $scope.authenticatedUser = undefined;

    if(AuthenticationService.isAuthenticated) {
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
        if(!$scope.isInLibrary()) {
            var userAddPublication = {id: $scope.authenticatedUser.id, library: $scope.authenticatedUser.library};
            userAddPublication.library.push({id:publication.id});
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
        //console.log(pub);
        function getPerson(id) {
            Person.get({id: id}, function(person) {
                $scope.persons[id] = person;
            }, function(data) {
                console.log('error: ' + data.error);
            });
        }

        User.get({id: pub.uploader}, function(user) {
            $scope.uploaderPersonId = user.person;
            if($scope.persons[user.person] !== undefined) {
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
            if(!$scope.persons[id]) {
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
                $scope.publications.push(publication);
            }, function(data) {
                $translate('ERROR').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.statusText, true);
                });
            });
        }
        if(pub.referencedPublications !== undefined){
            pub.referencedPublications.forEach(function(publication) {
                getPublication(publication.id);
            });
        }
    }, function(data) {
        $translate('ERROR').then(function(translated) {
            ToastService.showToast(translated + ': ' + data.statusText, true);
        });
    });

});
