'use strict';
describe('addUser',function(){

	describe('manageUserController',function(){
		var controller = null, $scope = null, httpBackend = null;
		var $mdToast, Person, PersonState, Affiliation;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			module('addUser');
		});


		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;
			AuthenticationService = {isAuthenticated: false};
			mdToast= {result:'',show:function(data){this.result=data.locals;}};

			controller = $controller('manageUserController', {
				$scope: $scope,
				Page: Page,
				$mdToast: mdToast,
				$animate: null,
				AuthenticationService: AuthenticationService
			});
		}));
	});
})