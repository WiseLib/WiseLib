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
        if ($scope.authenticatedUser && publication) {
            for (var i in $scope.authenticatedUser.library) {
                inLibrary = inLibrary || $scope.authenticatedUser.library[i].id === publication.id;
            }
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
                $translate('ADDED_TO_LIBRARY')
                    .then(function(translated) {
                        ToastService.showToast(translated);
                    })
            }, function(errorData) {
                console.log(errorData.error);
            });
        }
    };

    $scope.incrementSelectedIndex = function(i) {
        $scope.selectedIndex = $scope.selectedIndex + i;
    };

    Publication.get({
        id: $routeParams.id
    }, function(pub) {
        //console.log(pub);
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
            if ($scope.persons[user.person] !== undefined) {
                getPerson(user.person);
            }
        }, function(data) {
            console.log('error: ' + data.error);
        });
        $scope.publication = pub;
        for (var i = pub.authors.length - 1; i >= 0; i--) {
            var id = pub.authors[i].id;
            $scope.authors.push(id);
            if (!$scope.persons[id]) {
                getPerson(id);
            }
        }

        if (pub.editors !== undefined) {
            for (i = pub.editors.length - 1; i >= 0; i--) {
                var id = pub.editors[i].id;
                $scope.editors.push(id);
                if (!$scope.persons[id]) {
                    getPerson(id);
                }
            }
        }
        if (pub.references !== undefined) {
            for (i = pub.references.length - 1; i >= 0; i--) {
                Publication.get({id: pub.references[i].id}, function(publication) {
                    $scope.referencedPublications.push(publication);
                }, function(data) {
                    console.log('error: ' + data.error);
                });
            }
        }

        if(pub.unknownReferences !== undefined){
            for (var i = 0; i < pub.unknownReferences.length; i++) {
                var unknown = pub.unknownReferences[i].id;
                UnknownPublication.get({id:unknown},function(unknownpub){
                    $scope.referencedUnknownPublications.push(unknownpub.publications[0]);
                },function(){})
            };
        }
    }, function(data) {
        console.log('Error getting publication: ' + JSON.stringify(data));
    });

});