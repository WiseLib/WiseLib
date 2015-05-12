'use strict';
describe('Person test',function(){

	describe('personController',function(){
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

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location,$translate,_Person_,_Affiliation_,_Discipline_) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;

			controller = $controller('personController', {
				Page: Page,
				$scope: $scope,
				 $routeParams: {id:1}
			});

			Person=_Person_;
			Affiliation=_Affiliation_;
				
		}));

		describe('Load page test',function(){
			it('should make the correct requests',function(){

				httpBackend.expectGET('/persons/1.json').respond(201,{id:1,affiliation:1,disciplines:[1]});

				httpBackend.expectGET('/persons/1/publications.json').respond(201,{publications:[{id:1}]});
				httpBackend.whenGET('/affiliations/1.json').respond(201,{name:'VUB'});

				httpBackend.expectGET('/disciplines.json').respond(201,{});

				httpBackend.expectGET('/persons/1/contacts.json').respond(201,{persons:[{id:2},{id:3}]});

				httpBackend.flush();

				$scope.contacts.should.be.eql([{id:2},{id:3}]);
				$scope.person.affiliation.should.be.equal(' VUB');
				$scope.publications.should.be.eql([{id:1}])
			});
		});
	});
});