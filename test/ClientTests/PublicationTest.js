'use strict';
describe('Publication test',function(){

	describe('publicationController',function(){
		var $controller = null, $scope = null,$location = null,$mdToast = null;
		var httpBackend = null, location= null,mdToast =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('publication');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;

			controller = $controller('publicationController', {
				Page: Page,
				$scope: $scope,
				$routeParams: {id:1},
				TokenService:{setToken:function(token){},getUser:function(){}}
			});
				
		}));

		describe('Page load test',function(){
			it('should make the correct requests',function(){

				httpBackend.expectGET('/publications/1.json').respond(201,{uploader:2,authors:[{id:2},{id:3}],references:[{id:4}],unknownReferences:[{id:5}]});

				httpBackend.expectGET('/users/2.json').respond(201,{person:2})


				httpBackend.expectGET('/persons/2.json').respond(201,{id:2})

				httpBackend.expectGET('/persons/3.json').respond(201,{id:3})

				httpBackend.expectGET('/publications/4.json').respond(201,{id:4});

				httpBackend.expectGET('/unknownpublications.json/?id=5').respond(201,{publications:[{id:4}]});


				httpBackend.flush()

			});
		});
		describe('addToLibrary and InLibrary functions test',function(){
			it('should handle the functions corrrectly',function(){

				httpBackend.expectGET('/publications/1.json').respond(201,{authors:[]});
				httpBackend.whenGET('/users.json').respond(201)



				$scope.authenticatedUser={id:1,library:[{id:2}]};

				$scope.isInLibrary({id:1}).should.be.false;
				$scope.isInLibrary({id:2}).should.be.true;

				httpBackend.expectPUT('/users/1.json',{id:1,library:[{id:2},{id:1}]}).respond(201,{token:1});
				$scope.addToLibrary({id:1});

				httpBackend.flush();
			});
		})
	});
});