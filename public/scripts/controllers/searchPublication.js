'use strict';

angular.module('publication')

.controller('searchPublicationController', function($scope, $routeParams, $location, $window, $q, $translate, Page, Publication, WebSearchPublication, Person, User, GetApiToken, ToastService) {

    $translate('SEARCH_A_PUBLICATION').then(function(translated) {
        Page.setTitle(translated);
    });

    if($routeParams.q) {
        var tags = $routeParams.q.split('@');
        $scope.keyword = tags.shift();
        for(var i in tags) {
            if(tags[i] === 'title') $scope.checkTitle = true;
            if(tags[i] === 'authors') $scope.checkAuthor = true;
            if(tags[i] === 'journal') $scope.checkJournal = true;
            if(tags[i] === 'conference') $scope.checkConference = true;
        }
    }

    $scope.searching = function(){ return true;};

    $scope.foundPublications = [];

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
        arrays.forEach(function(array) {
            array.length = 0;
        });
    };

    $scope.addFilters = function(keyword) {
        var query = '';
        if ($scope.checkTitle) query += 'title=' + keyword + '&';
        if ($scope.checkAuthor) query += 'author=' + keyword + '&';
        if ($scope.checkJournal) query += 'journal=' + keyword + '&';
        if ($scope.checkConference) query += 'proceeding=' + keyword + '&';

        return query;
    };

    $scope.addSearchQueries = function(keyword) {
        var query = keyword;
        if ($scope.checkTitle) query += '@title';
        if ($scope.checkAuthor) query += '@authors';
        if ($scope.checkJournal) query += '@journal';
        if ($scope.checkConference) query += '@proceeding';

        return query;
    };

    $scope.handleData = function(data) {
        if(data) {
            data.forEach(function(publication) {
                (function(publication){//This is neccessary otherwise only last publication wil be added!!
                var promises = [];
                //get uploader person
                var deferred = $q.defer();
                promises.push(deferred.promise);
                User.get({id: publication.uploader}, function(userData) {
                    Person.get({id: userData.person}, function(personData) {
                        deferred.resolve(personData);
                    }, function(personData) {
                        ToastService.showToast(personData.statusText, false);
                    });
                }, function(userData) {
                    ToastService.showToast(userData.statusText, true);
                });
                //get authors
                var authors = publication.authors;
                if(authors.length === 0) {
                    authors.push({id: publication.uploader});
                }
                authors.forEach(function(author) {
                    //needed to make `deferred` local (see javascript function/loop/closure scopes)
                    var success = function() {
                        var deferred = $q.defer();
                        promises.push(deferred.promise);
                        return function(personData) {
                            deferred.resolve(personData);
                        };
                    };
                    Person.get({id: author.id}, success(), function(personData) {
                        ToastService.showToast(personData.statusText, false);
                    });
                });
                $q.all(promises).then(function(personDataArray) {
                    //first promise is uploader
                    publication.uploader = personDataArray[0];
                    //next promises are authors
                    for(var j = 1; j < personDataArray.length; j++) {
                        publication.authors[j-1] = personDataArray[j];
                    }
                    //add to results
                    $scope.add($scope.foundPublications, publication);
                }, function(reason) {
                    $translate('ERROR').then(function(translated) {
                        ToastService.showToast(translated + ': ' + reason, true);
                    });
                });

            })(publication);
            });
        }
    };

    $scope.HandleExternData = function(data) { //arrary of id,title,authors(array of {first_name:?,last_name?}),link,abstract,year,source

        data.forEach(function(externPub) {
            $scope.add($scope.foundPublications, externPub);
        });
    };

    $scope.accessToken = undefined;
    $scope.websearch = function() {

        $scope.empty([$scope.foundPublications]);

        var webSearch = function() {
            WebSearchPublication.query({
                query: query,
                token: $scope.accessToken
            }, function(data) {
                $scope.HandleExternData(data);
            }, function(data) { //error from server
                $translate('COULD_NOT_GET_A_RESULT').then(function(translated) {
                    ToastService.showToast(translated + ': ' + keyword + ' :' + data.statusText, true);
                });
            });
        };

        var query = $scope.addFilters($scope.keyword);
        var body = 'grant_type=refresh_token&refresh_token=MSwzMDYyNzE5NzEsMTAyOCxhbGwsLCxtc0xxM0s1V3NoTWNCYk5SYUlsVXZjbHgySzQ%3E&redirect_uri=localhost%253A8080%252Fsearch';

        if ($scope.accessToken === undefined) {
            GetApiToken.get(body, function(data) {

                $scope.accessToken = data.access_token;
                webSearch();

            }, function(data) {
                $translate('ERROR').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.statusText, true);
                });
            });
        } else {
            webSearch();
        }
    };

    $scope.search = function() {

        $scope.empty([$scope.foundPublications]);

        var query = $scope.addSearchQueries($scope.keyword);
        Publication.search({q: query}, function(data) {
            $scope.handleData(data.publications);
        }, function(data) { //error from server
            $translate('COULD_NOT_GET_A_RESULT').then(function(translated) {
                ToastService.showToast(translated + ': ' + keyword + ' :' + data.statusText, true);
            });
        });
        $location.search({q: query});
    };

});