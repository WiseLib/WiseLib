'use strict';
describe('TESTNAME',function(){

	describe('CONTROLLERNAMEHERE',function(){
		var $controller = null, $scope = null,$location = null,$mdToast = null;
		var httpBackend = null, location= null,mdToast =null, Person =null, PersonState =null, Affiliation =null;
		var controller;

		var Page= {title : '',setTitle: function (text){title= text;}};

		beforeEach(function(){
			angular.mock.module('MODULENAMEHERE');
		});
		beforeEach(inject(function(_$controller_){
    		$controller = _$controller_;
  		}));

		beforeEach(inject(function ($controller,$rootScope,$httpBackend,$location,_Person_,_PersonState_,_Affiliation_) {
			$scope = $rootScope.$new();
			httpBackend = $httpBackend;
			location = $location;
			mdToast= {result:'',show:function(data){this.result=data.locals;}};

			controller = $controller('CONTROLLERNAMEHERE', {
				Page: Page,
				$scope: $scope,
				$mdToast: mdToast
			});
				
			$mdToast= mdToast;
			Person=_Person_;
			PersonState=_PersonState_;
			Affiliation=_Affiliation_
			
		}));

		describe('',function(){
			it('',function(){

			});
		});
	});
});