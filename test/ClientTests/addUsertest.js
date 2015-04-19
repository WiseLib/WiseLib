'use strict';
describe('addUser',function(){

	describe('registerUserController',function(){
		var $controller = null, $scope = null,$location = null,$mdToast = null;
		var httpBackend = null, location= null,AuthenticationService =null,mdToast =null,User =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('user');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location,_AuthenticationService_,_User_,_Person_,_PersonState_,_Affiliation_) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;
			AuthenticationService = _AuthenticationService_;
			mdToast= {result:'',show:function(data){this.result=data.locals;}};

			controller = $controller('registerUserController', {
				Page: Page,
				$scope: $scope,
				$mdToast: mdToast
			});
				
			$mdToast= mdToast;
			User=_User_;
			Person=_Person_;
			PersonState=_PersonState_;
			Affiliation=_Affiliation_
			
		}));

		describe('Register new person test',function(){
			it('should create new person succeed',function(done){
				$scope.userForm.email = 'emailTest';
				$scope.userForm.password = 'passwordTest';

				PersonState.person={firstName:'John',lastName:'Teller',affiliation:1}

				httpBackend.expectPOST('/persons.json',{firstName: 'John',lastName: 'Teller',affiliation:1}).respond(201,{id:1});
				httpBackend.expectPOST('/users.json',{email: 'emailTest',password: 'passwordTest',person:1}).respond(201,{id:1});

				$scope.createUser();
				httpBackend.flush();
				AuthenticationService.isAuthenticated.should.be.true;
				$mdToast.result.text.should.be.equal('"SUCCESSFULLY_REGISTERED"');//cannot check error as translate will fail.
				done();
			});

			it('should give an error',function(done){
				$scope.userForm.email = 'emailTest';
				$scope.userForm.password = 'passwordTest';

				PersonState.person={firstName:'John',lastName:'Teller',affiliation:1}

				httpBackend.expectPOST('/persons.json',{firstName: 'John',lastName: 'Teller',affiliation:1}).respond(401,{});

				$scope.createUser();
				httpBackend.flush();
				AuthenticationService.isAuthenticated.should.be.false;
				done();
			});
		});

		describe('Register old person test',function(){
			it('should create new person succeed',function(done){
				$scope.userForm.email = 'emailTest';
				$scope.userForm.password = 'passwordTest';

				PersonState.person={id:1};

				httpBackend.expectPOST('/users.json',{email: 'emailTest',password: 'passwordTest',person:1}).respond(201,{id:1});

				$scope.createUser();
				httpBackend.flush();
				AuthenticationService.isAuthenticated.should.be.true;
				$mdToast.result.text.should.be.equal('"SUCCESSFULLY_REGISTERED"');//cannot check error as translate will fail.
				done();
			});
		});
	});
});