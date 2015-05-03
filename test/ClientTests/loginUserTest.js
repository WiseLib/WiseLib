'use strict';
describe('LoginUserTest',function(){

	describe('loginUserController',function(){
		var $controller = null, $scope = null,$location = null;
		var httpBackend = null, location= null,User =null, Person =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('user');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location,$translate) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;

			controller = $controller('loginUserController', {
				Page: Page,
				$scope: $scope,
				TokenService:{setToken:function(token){$scope.token=token}}
			});
				
		}));

		describe('Login User Test',function(){
			it('should make the correct put request',function(){

				$scope.loginUserForm={email:'NewEmail',password:'NewPassword'};

				httpBackend.expectPOST('/login',{email:'NewEmail',password:'NewPassword'}).respond(201,{token:true});

				$scope.login();
				httpBackend.flush();

				$scope.token.should.be.true;
				location.path().should.be.equal('/')

			});
		});
	});
});