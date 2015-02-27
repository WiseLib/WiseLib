'use strict';
var module = angular.module('publication', ['communication', 'proceeding', 'ngMaterial']);

module.controller('uploadPublicationController', ['$scope','$http', 'fetcher', 'Page', function ($scope,$http, fetcher, Page, Person) {

    Page.setTitle('Upload publication');
    $scope.authors = [];
    $scope.disciplines = [];
    $scope.references = [];
    $scope.fetcher = fetcher;

    $scope.chooseJournal = function(jour){
        $scope.journal = jour;
    }

    $scope.add = function (array, element) {
        if (array.indexOf(element) === -1) {
            array.push(element);
            console.log('added ' + element + ' to ' + JSON.stringify(array));
        }
    };

    $scope.remove = function (array, element) {
        var i = array.indexOf(element);
        if (i > -1) {
            array.splice(i, 1);
            console.log('removed ' + JSON.stringify(element) + ' from ' + JSON.stringify(array));
        }
    };

    $scope.upload = function(files){

        var fd = new FormData();
        fd.append("file", files[0]);

        $http.post('uploadfile', fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
        }).
        success(function(data, status, headers, config) {
        $scope.localfile = true;

        $scope.title = data.title;
        $scope.numberOfPages=data.numberofpages;
        $scope.url = data.path;

        var index;
        for (index = 0; index < data.authors.length; ++index) {
            $scope.add($scope.authors,data.authors[index]);
        }   


        }).
        error(function(data, status, headers, config) {
        });

    }

    $scope.post = function () {
        var toPost = {};
        toPost.title = $scope.title;
        toPost.numberOfPages = $scope.numberOfPages;
        toPost.year = $scope.year;
        toPost.url = $scope.url;
        var discArray = new Array($scope.disciplines.length);
        for (var i = 0; i < $scope.disciplines.length; i++) {
            discArray[i] = {id: $scope.disciplines[i].id};
        }
        var authArray = new Array($scope.authors.length);
        for (var i = 0; i < $scope.authors.length; i++) {
            authArray[i] = {id: $scope.authors[i].id};
        }
        toPost.disciplines = discArray;
        toPost.authors = authArray;
        toPost.type = $scope.type;
        if ($scope.type === 'Journal') {
            toPost.journalId = $scope.journal.id;
            toPost.volume = $scope.volume;
            toPost.number = $scope.number;
        }
        else {
            toPost.proceedingId = $scope.proceeding.id;
            toPost.editors = $scope.editors;
            toPost.publisher = $scope.publisher;
            toPost.city = $scope.city;
        }
        console.log('POST : ' + JSON.stringify(toPost));
        //$http.post('users/1/publications.json', toPost);
    };
}]);