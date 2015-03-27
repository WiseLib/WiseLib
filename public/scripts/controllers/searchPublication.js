'use strict';

angular.module('searchPublication', [])

.controller('searchPublicationController',function($scope,$window,Page,SearchPublication,WebSearchPublication,PersonById,User,$mdToast){

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

	$scope.handledata = function(data){

		if(data)for (var i = 0; i < data.length; i++) {

			var publication = data[i];

			(function(publication){

				var uploaderId = publication.uploader;
				var uploaderUser = new User({id: uploaderId});

				uploaderUser.$get(function(data){
					uploaderId = data.person
					var uploader = new PersonById({id: uploaderId});
					uploader.$get(function(data){

						publication.uploader = data.firstName + ' ' + data.lastName;

						var authors = publication.authors;
						publication['personAuthors']=[];
						if(authors.length == 0)authors.push({id : uploaderId});

						for (var i = 0; i < authors.length; i++) {
							var author = authors[i];
							author = new PersonById({id: author.id})

							author.$get(function(data){ 
								publication.personAuthors.push(data.firstName  + ' ' + data.lastName);

								if(i = authors.length)$scope.add($scope.foundPublications,publication);

							},function(data){})
						};
					},function(data){})
				},function(data){})

				

			}(publication));
		};

	}


	$scope.websearch = function(){


		var keyword = $scope.keyword;

		var query = '';

		if($scope.checkTitle) query +='title=' + keyword + '&';
		if($scope.checkAuthor) query+= 'author=' + keyword + '&';
		if($scope.checkJournal) query += 'journal' + keyword + '&';
		if($scope.checkConference) query += 'conference' + keyword + '&';


		var search = new WebSearchPublication({query:query});

		search.$query(function(data){
			$scope.handledata(data);
		}),function(data,status){//error from server
			$scope.showSimpleToast("Could not get a result: " + keyword + " :" + status);
		}

	};

	$scope.search = function(){

		$scope.empty([$scope.foundPublications]);

		var keyword = $scope.keyword

		var query=keyword;

		if($scope.checkTitle) query +='@title';
		if($scope.checkAuthor) query+= '@author';
		if($scope.checkJournal) query += '@journal';
		if($scope.checkConference) query += '@conference';


		var search = new SearchPublication({q: query});

		search.$get(function(data){
			$scope.handledata(data.publications);
		}),function(data,status){//error from server
			$scope.showSimpleToast("Could not get a result: " + keyword + " :" + status);
		}
	}

});