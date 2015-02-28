'use strict';

var module = angular.module('addPublication', ['communication', 'proceeding', 'ngMaterial'])
module.controller('uploadPublicationController', function ($scope,$http, fetcher, Page,$mdToast, Person) {

    Page.setTitle('Upload publication');
    $scope.authors = [];
    $scope.disciplines = [];
    $scope.references = [];
    $scope.JSONreferences = [];
    $scope.fetcher = fetcher;

    $scope.chooseJournal = function(jour){
        $scope.journal = jour;
    };

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


    $scope.showSimpleToast = function(text) {
    $mdToast.show(
      $mdToast.simple()
        .content(text)
        .position('top right')
        .hideDelay(3000)
    );
  };

    $scope.uploadpdf = function(files){

        var fd = new FormData();
        fd.append('file', files[0]);

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

        $scope.authors = [];
        var index;
        for (index = 0; index < data.authors.length; ++index) {
            $scope.add($scope.authors,data.authors[index]);
        }   

            var index;
            for (index = 0; index < data.authors.length; ++index) {
                $scope.add($scope.authors,data.authors[index]);
            }


        }).
        error(function(data, status, headers, config) {
        $scope.showSimpleToast("Not a pdf");
        });
    };

    $scope.uploadbibtex = function(files){

        var fd = new FormData();
        fd.append("file", files[0]);

        $http.post('uploadfile', fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
        }).
        success(function(data, status, headers, config) {

        

        var index;
        $scope.JSONreferences=[];
        $scope.references=[];
        for (index = 0; index < data.length; ++index) {
            var reference = data[index];
            $scope.add($scope.JSONreferences,reference);

            var title = reference.entryTags.title;
            $scope.add($scope.references,title);
        }   


        }).
        error(function(data, status, headers, config) {
            $scope.showSimpleToast("Not a bibtex");
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
        for (i = 0; i < $scope.authors.length; i++) {
            authArray[i] = {id: $scope.authors[i].id};
        }
        toPost.disciplines = discArray;
        toPost.authors = authArray;
        toPost.references = $scope.JSONreferences;
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

});
