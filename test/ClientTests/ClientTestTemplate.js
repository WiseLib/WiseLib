'use strict';
describe('TESTNAME',function(){

	describe('CONTROLLERNAME',function(){
		var $controller = null, $scope = null,$location = null,$mdToast = null;
		var httpBackend = null, location= null,mdToast =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('MODULENAME');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;

			controller = $controller('CONTROLLERNAME', {
				Page: Page,
				$scope: $scope,
			});
				
		}));

		describe('',function(){
			it('',function(){

			});
		});
	});
});