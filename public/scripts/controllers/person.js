'use strict';
var module = angular.module('personCtrlr', ['communication', 'proceeding', 'ngMaterial']);

module.controller('personController', function ($scope,$window, $routeParams, Page, Person) {
	Page.setTitle('Person');
	
});