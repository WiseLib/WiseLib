'use strict';
describe('EditUserTest',function(){

	describe('updateUserController',function(){
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

			controller = $controller('updateUserController', {
				Page: Page,
				$scope: $scope,
				TokenService:{getUser:function(){return {id:10,person:1}}}
			});
				
		}));

		describe('Update User Test',function(){
			it('should make the correct put request',function(){

				$scope.userEditForm={email:'NewEmail',password:'NewPassword'};

				httpBackend.expectPUT('/users/10.json',{email:'NewEmail',password:'NewPassword',id:10}).respond(201,{});

				$scope.updateUser();
				httpBackend.flush();

			});
		});
		describe('Update Person Test',function(){
			it('should make the correct put request',function(){

				$scope.personEditForm={firstName:'NewFirstNAme',lastName:'NewLastName'};

				httpBackend.expectPUT('/persons/1.json',{firstName:'NewFirstNAme',lastName:'NewLastName',id:1}).respond(201,{});

				$scope.updatePerson();
				httpBackend.flush();

			});
		});


	});
});