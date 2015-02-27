'use strict';
var myPublications = angular.module('myPublications', []);
myPublications.controller('myPublicationsController', function($scope, $window, Page, Publication) {
	Page.setTitle('My publications');

	var token = $window.sessionStorage.token;
	var userId = parseInt(atob(token.split('.')[1]), 10);
	Publication.query({id: userId}, function(data) {
		console.log('got data!');
		console.log(data);
		$scope.publications = data.publications;
	}, function(error) {
		console.warn('error:' + error);
	});

	// $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
	// 					   {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});