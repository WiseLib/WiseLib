'use strict';
describe('addUser',function(){

	describe('manageUserController',function(){
		var controller = null, $scope = null, httpBackend = null, authRequestHandler= null, location= null,AuthenticationService,mdToast;

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

		describe('searchPerson Test',function(){
			it('should work',function(done){
				authRequestHandler = httpBackend.when('GET', '/persons.json?firstName=Jan&lastName=Modaal').respond({persons: 'Test'});
				$scope.userForm.firstName = 'Jan';
				$scope.userForm.lastName = 'Modaal';
				httpBackend.expectGET('/persons.json?firstName=Jan&lastName=Modaal');
				$scope.$apply();
				httpBackend.flush();

				$scope.persons.should.not.be.empty;
				done();
			});
		});

		describe('Register person test',function(){
			it('should succeed',function(done){
				$scope.userForm.firstName = 'Test';
				httpBackend.expectPOST('user.json',{firstName: 'Test',profileImageSrc: ''}).respond(201,'');
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