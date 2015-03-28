'use strict';
var module = angular.module('publication');

module.controller('publicationController', function($scope, $window, $routeParams, Page, Publication, Person, User) {
    Page.setTitle('Publication');
    $scope.publication = undefined;
    $scope.persons = {};
    $scope.authors = [];
    $scope.editors = [];
    $scope.publications = [];

    Publication.get({id: $routeParams.id}, function(pub) {
        console.log(pub);
        function getPerson(id) {
            Person.get({id: id}, function(person) {
                $scope.persons[id] = person;
            }, function(data) {
                console.log('error: ' + data.error);
            });
        }

        User.get({id: pub.uploader}, function(user) {
            console.log('got user! ' + JSON.stringify(user));
            $scope.uploaderPersonId = user.person;
            if(!$scope.persons[user.person]) {
                getPerson(user.person);
            }
        }, function(data) {
            console.log('error: ' + data.error);
        });
        $scope.publication = pub;
        for (var i = pub.authors.length - 1; i >= 0; i--) {
            var id = pub.authors[i].id;
            $scope.authors.push(id);
            if(!$scope.persons[id]) {
                getPerson(id);
            }
        }

        for (i = pub.editors.length - 1; i >= 0; i--) {
            var id = pub.editors[i].id;
            $scope.editors.push(id);
            if(!$scope.persons[id]) {
                getPerson(id);
            }
        }

        function getPublication(id) {
            Publication.get({id: id}, function(publication) {
                $scope.publications.push(publication);
            }, function(data) {
                console.log('error: ' + data.error);
            });
        }
        for (i = pub.referencedPublications.length - 1; i >= 0; i--) {
            getPublication(pub.referencedPublications[i].id);
        }
    }, function(data) {
        console.log('Error getting publication: ' + JSON.stringify(data));
    });

});