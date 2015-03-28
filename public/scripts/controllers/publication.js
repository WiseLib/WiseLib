'use strict';
var module = angular.module('publication');

module.controller('publicationController', function($scope, $window, $routeParams, Page, Publication, Person) {
    Page.setTitle('Publication');
    $scope.publication = undefined;
    $scope.authors = [];
    $scope.publications = [];

    Publication.get({id: $routeParams.id}, function(pub) {
        console.log(pub);
        function getPerson(id) {
            Person.get({id: id}, function(person) {
                $scope.authors.push(person);
            }, function(data) {
                console.log('error: ' + data.error);
            });
        }
        $scope.publication = pub;
        for (var i = pub.authors.length - 1; i >= 0; i--) {
            getPerson(pub.authors[i].id);
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