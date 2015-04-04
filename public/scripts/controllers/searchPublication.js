'use strict';

angular.module('publication')

.controller('searchPublicationController', function($scope, $window, $mdToast, Page, Publication, WebSearchPublication, Person, User, GetApiToken) {

    Page.setTitle('Search a publication');

    $scope.searching = function(){ return true;};

    $scope.showSimpleToast = function(text) {
        $mdToast.show({
            controller: 'ToastCtrl',
            templateUrl: '../views/feedback-toast.html',
            hideDelay: 6000,
            position: 'top right',
            locals: {
                text: text,
                error: false
            }
        });
    };

    //$scope.foundAuthor = []; //all publications from given author

    //$scope.foundJournal = [];//all publications in given journal

    //$scope.foundProceeding = [];//idem from proceeding

    $scope.foundPublications = []; //results from search on title

    $scope.add = function(array, element) {
        if (array.indexOf(element) === -1) {
            array.push(element);
        }
    };

    $scope.remove = function(array, element) {
        var i = array.indexOf(element);
        if (i > -1) {
            array.splice(i, 1);
        }
    };

    $scope.empty = function(arrays) {
        for (var i = 0; i < arrays.length; i++) {
            arrays[i].length = 0;
        }
    };

    $scope.handledata = function(data) {

        if (data)
            for (var i = 0; i < data.length; i++) {

                var publication = data[i];

                (function(publication) {

                    var uploaderId = publication.uploader;
                    var uploaderUser = new User({
                        id: uploaderId
                    });

                    uploaderUser.$get(function(data) { //lookup the uploader
                        uploaderId = data.person;
                        var uploader = new Person({
                            id: uploaderId
                        });
                        uploader.$get(function(data) {

                            publication.uploader = data;

                            var authors = publication.authors;
                            publication.personAuthors = [];
                            if (authors.length === 0) authors.push({
                                id: uploaderId
                            });

                            var count = -1;
                            for (var i = 0; i < authors.length; i++) {
                                var author = authors[i];
                                author = new Person({
                                    id: author.id
                                });

                                (function(i) {
                                    author.$get(function(data) { //lookup each author of the publication
                                        authors[i] = data;
                                        count = count + 1;
                                        console.log(count);
                                        if (count === (authors.length - 1)) $scope.add($scope.foundPublications, publication); //add publication to result list when all authors are looked up.

                                    }, function(data) {
                                        $scope.showSimpleToast(data.statusText);
                                    });
                                }(i));
                            }
                        }, function(data) {
                            $scope.showSimpleToast(data.statusText);
                        });
                    }, function(data) {
                        $scope.showSimpleToast(data.statusText);
                    });
                }(publication));
            }

    };

    $scope.HandleExternData = function(data) { //arrary of id,title,authors(array of {first_name:?,last_name?}),link,abstract,year,source

        for (var i = 0; i < data.length; i++) {
            var externPub = data[i];

            $scope.add($scope.foundPublications, externPub);
        }

    };

    $scope.access_token = undefined;
    $scope.websearch = function() {

        $scope.empty([$scope.foundPublications]);

        function websearch() {
            WebSearchPublication.query({
                    query: query,
                    token: $scope.access_token
                }, function(data) {
                    $scope.HandleExternData(data);
                }),
                function(data) { //error from server
                    $scope.showSimpleToast("Could not get a result: " + keyword + " :" + data);
                };
        }

        var keyword = $scope.keyword;

        var query = '';

        if ($scope.checkTitle) query += 'title=' + keyword + '&';
        if ($scope.checkAuthor) query += 'author=' + keyword + '&';
        if ($scope.checkJournal) query += 'journal' + keyword + '&';
        if ($scope.checkConference) query += 'conference' + keyword + '&';


        var body = 'grant_type=refresh_token&refresh_token=MSwzMDYyNzE5NzEsMTAyOCxhbGwsLCxtc0xxM0s1V3NoTWNCYk5SYUlsVXZjbHgySzQ%3E&redirect_uri=localhost%253A8080%252Fsearch';

        if ($scope.access_token === undefined) {
            GetApiToken.get(body, function(data) {

                $scope.access_token = data.access_token;
                websearch();

            }, function(data) {
                $scope.showSimpleToast("External search: " + data.statusText);
            });
        } else {
            websearch();
        }
    };

    $scope.search = function() {

        $scope.empty([$scope.foundPublications]);

        var keyword = $scope.keyword;

        var query = keyword;

        if ($scope.checkTitle) query += '@title';
        if ($scope.checkAuthor) query += '@authors';
        if ($scope.checkJournal) query += '@journal';
        if ($scope.checkConference) query += '@conference';


        var search = new Publication({
            q: query
        });

        search.$search(function(data) {
                $scope.handledata(data.publications);
            }),
            function(data) { //error from server
                $scope.showSimpleToast("Could not get a result: " + keyword + " :" + data.status);
            };
    };

});