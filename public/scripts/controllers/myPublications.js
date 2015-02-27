'use strict';
var myPublications = angular.module('myPublications', []);
myPublications.controller('myPublicationsController', function($scope, Page) {
	Page.setTitle('My publications');
	$scope.publications = [];
});