'use strict';
describe('Person library test',function(){

	describe('myLibraryController',function(){
		var $controller = null, $scope = null,$location = null,$mdToast = null;
		var httpBackend = null, location= null,mdToast =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){this.title= text;}};

		beforeEach(function(){
			angular.mock.module('publication');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location,$translate) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;

			controller = $controller('myLibraryController', {
				Page: Page,
				$scope: $scope,
				TokenService:{
					token:0,
					getUser:function(){if(!this.token)return {id:1,library:[{id:1},{id:2},{id:3}]};
									   else return {id:1,library:[{id:1},{id:3}]};},
					setToken:function(){this.token = token}},
				$translate : function(string){return new Promise(function(resolve,reject){resolve(string);})},
				$mdDialog : {confirm:function(){return {title:function(x){return this;},content:function(x){return this;},ariaLabel:function(x){return this;},ok:function(x){return this;},cancel:function(x){return this;}};},
							 show:function(something){return new Promise(function(resolve,reject){resolve();})}}
			});
				
		}));

		describe('getLibrary test',function(){
			it('should make the correct get request and transfer publications',function(){

				httpBackend.expectGET('/users/1/library.json').respond(201,{publications:['test']});
				httpBackend.flush();

				$scope.publications.should.not.be.empty;
			});
			it('should make the correct get request and give an error',function(){

				httpBackend.expectGET('/users/1/library.json').respond(201,{publications:[]});
				$scope.publications.should.be.empty;

			})
		});

		describe('delete publication test',function(){
			it('should make the correct put request',function(){

				httpBackend.expectGET('/users/1/library.json').respond(201,{publications:[{id:1},{id:2},{id:3}]});

				$scope.deletePublication({id:2});

				$scope.user.library.should.be.equal([{id:1},{id:3}]);

				httpBackend.expectPUT('/users/1.json',{id:1,library:[{id:1},{id:3}]}).respond(201,{token:1});
				httpBackend.flush()
				
				$scope.publications.should.be.equal([{id:1},{id:3}]);
			})
		})
	});
});