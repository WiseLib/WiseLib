'use strict';
var module = angular.module('person');
module.controller('networkController', function($scope, $routeParams, $translate, Page, Person, TokenService, $rootScope) {
	$translate('NETWORK').then(function(translated) {
		Page.setTitle(translated);
	});
	$scope.showLoading = true;
	$scope.network = [];
	var user;
	try {
        user = TokenService.getUser();
    } catch(error) {
        $translate('LOGGED_IN_VIEW_REQUIREMENT').then(function(translated) {
            $scope.error = translated;
        });
        $scope.showLoading = false;
        return;
    }
	Person.network({id: user.person}, function(data) {
        $scope.network = data.network;
        $scope.$apply();
		$scope.showLoading = false;
		$rootScope.$broadcast('appChanged');


    }, function(data) {
  		$scope.error = data.statusText;
  		$scope.showLoading = false;
  });
});