'use strict';

angular.module('searchPublication', [])

.controller('searchPublicationController',function($scope,$window,Page,SearchPublication,$mdToast){

	Page.setTitle('Search a publication');

	//$scope.foundAuthor = []; //all publications from given author

	//$scope.foundJournal = [];//all publications in given journal

	//$scope.foundProceeding = [];//idem from proceeding

	$scope.foundPublications = [];//results from search on title

	$scope.add = function (array, element) {
		if (array.indexOf(element) === -1) {
			array.push(element);
		}
	};

	$scope.remove = function (array, element) {
		var i = array.indexOf(element);
		if (i > -1) {
			array.splice(i, 1);
		}
	};

	$scope.empty = function(arrays){
		for (var i = 0; i < arrays.length; i++) {
			arrays[i].length = 0;
		};
	}

	$scope.search = function(){

		$scope.empty([$scope.foundPublications]);

		function handledata(data){

			/*if(data.forAuthor) for (var i = 0; i < data.forAuthor.length; i++) {
				$scope.add($scope.foundAuthor,data.forAuthor[i])
			};

			if(data.forJournal) for (var i = 0; i < data.forJournal.length; i++) {
				$scope.add($scope.foundJournal,data.forJournal[i])
			};

			if(data.forProceeding)for (var i = 0; i < data.forProceeding.length; i++) {
				$scope.add($scope.foundProceeding,data.forProceeding[i])
			};*/

			if(data)for (var i = 0; i < data.length; i++) {
				$scope.add($scope.foundPublications,data[i])
			};

		}

		var keyword = $scope.keyword

		var query=keyword;

		if($scope.checkTitle) query +='@title';
		if($scope.checkAuthor) query+= '@author';
		if($scope.checkJournal) query += '@journal';
		if($scope.checkConference) query += '@conference';

		console.log(query);

		var search = new SearchPublication({q: query});

		search.$get(function(data){
			handledata(data.publications);
		}),function(data){//error from server
			$scope.showSimpleToast("Could not get a result: " + keyword + " :" + status);
			return;

		}
	}

});