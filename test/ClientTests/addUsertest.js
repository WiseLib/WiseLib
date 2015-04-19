'use strict';
describe('addUser',function(){

	describe('registerUserController',function(){
		var $controller = null, $scope = null,$location = null,$mdToast;
		var httpBackend = null, authRequestHandler= null, location= null,AuthenticationService =null,mdToast =null,User =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('user');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location,_User_,_Person_,_PersonState_,_Affiliation_) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;
			AuthenticationService = {isAuthenticated: false};
			mdToast= {result:'',show:function(data){this.result=data.locals;}};

			controller = $controller('registerUserController', {
				$scope: $scope,
				Page: Page,
				$mdToast: mdToast,
				AuthenticationService: AuthenticationService,

				User:_User_,
				Person:_Person_,
				PersonState:_PersonState_,
				Affiliation:_Affiliation_
			});
		}));

		describe('Register new person test',function(){
			it('should succeed',function(done){
				$scope.userForm.email = 'emailTest';
				$scope.userForm.email = 'passwordTest';

				httpBackend.expectPOST('person.json',{firstName: 'Test',profileImageSrc: ''}).respond(201,'');
				$location= location;
				$mdToast= mdToast;
				$scope.createUser();
				httpBackend.flush();
				AuthenticationService.isAuthenticated.should.be.true;
				$mdToast.result.error.should.be.false;
				done();
			});

			it('should give an error',function(done){
				$scope.userForm.firstName = 'Test';
				httpBackend.expectPOST('user.json',{firstName: 'Test',profileImageSrc: ''}).respond(401,'');
				$location= location;
				$mdToast = mdToast;
				$scope.createUser();
				httpBackend.flush();
				AuthenticationService.isAuthenticated.should.be.false;
				$mdToast.result.error.should.be.true;
				done();
			});
		});
	});

});