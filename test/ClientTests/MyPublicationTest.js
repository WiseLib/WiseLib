'use strict';
describe('My publications test',function(){

	describe('myPublicationsController',function(){
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

			controller = $controller('myPublicationsController', {
				Page: Page,
				$scope: $scope,
				TokenService:{getUser:function(){return {person:1};}}
			});
				
		}));

		describe('Page load test',function(){
			it('should make the correct GET request and transfer publications',function(){
				httpBackend.expectGET('/persons/1/publications.json').respond(201,{publications:['test']});
				httpBackend.flush();

				$scope.publications.should.not.be.empty;
			});
			it('should make the correct get request and give an error',function(){

				httpBackend.expectGET('/persons/1/publications.json').respond(201,{publications:[]});
				$scope.publications.should.be.empty;

			})
		});
	});
});