'use strict';
describe('addPerson test',function(){

	describe('addPersonController',function(){
		var $controller = null, $scope = null,$location = null,$mdToast = null;
		var httpBackend = null, location= null,mdToast =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('person');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;
			mdToast= {result:'',show:function(data){this.result=data.locals;}};

			controller = $controller('addPersonController', {
				Page: Page,
				$scope: $scope,
				$mdToast: mdToast,
				ToastService:{showToast:function(x){}},
			});
			
		}));

		describe('Name fields test',function(){
			it('should should request HTTPpost',function(){
				$scope.person.firstName = 'firstTest';
				$scope.person.lastName = 'lastTest';

				httpBackend.whenGET('/persons.json?firstName=firstTest&lastName=lastTest').respond(201,{persons:'Succeeded'})

				httpBackend.expectGET('/affiliations.json?parent=').respond(201,{})//request happens on page load

				httpBackend.flush();

				$scope.persons.should.be.equal('Succeeded');
			});
		});
	});
});