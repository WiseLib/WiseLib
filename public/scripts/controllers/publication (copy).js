'use strict';
var module = angular.module('publication', ['communication', 'proceeding', 'ngMaterial']);

module.controller('uploadPublicationController', ['$scope','$http', 'fetcher', 'Page', function ($scope,$http, fetcher, Page, Person) {
    Page.setTitle('Upload publication');
    this.authors = [];
    this.disciplines = [];
    this.fetcher = fetcher;

    this.add = function (array, element) {
        if (array.indexOf(element) === -1) {
            array.push(element);
            console.log('added ' + JSON.stringify(element) + ' to ' + JSON.stringify(array));
        }
        console.log('called add with ' + JSON.stringify(element) + ' and ' + JSON.stringify(array));
    };

    this.remove = function (array, element) {
        var i = this.authors.indexOf(element);
        if (i > -1) {
            this.authors.splice(i, 1);
            console.log('removed ' + JSON.stringify(element) + ' from ' + JSON.stringify(array));
        }
        console.log('called remove with ' + JSON.stringify(element) + ' and ' + JSON.stringify(array));
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

        this.title = data.title;
        //this.numberOfPages=data.numberofpages;
        //this.url = data.path;


        }).
        error(function(data, status, headers, config) {
        });

    }

    this.post = function () {
        var toPost = {};
        toPost.title = this.title;
        toPost.numberOfPages = this.numberOfPages;
        toPost.year = this.year;
        toPost.url = this.url;
        var discArray = new Array(this.disciplines.length);
        for (var i = 0; i < this.disciplines.length; i++) {
            discArray[i] = {id: this.disciplines[i].id};
        }
        var authArray = new Array(this.authors.length);
        for (var i = 0; i < this.authors.length; i++) {
            authArray[i] = {id: this.authors[i].id};
        }
        toPost.disciplines = discArray;
        toPost.authors = authArray;
        toPost.type = this.type;
        if (this.type === 'Journal') {
            toPost.journalId = this.journal.id;
            toPost.volume = this.volume;
            toPost.number = this.number;
        }
        else {
            toPost.proceedingId = this.proceeding.id;
            toPost.editors = this.editors;
            toPost.publisher = this.publisher;
            toPost.city = this.city;
        }
        console.log('POST : ' + JSON.stringify(toPost));
        //$http.post('users/1/publications.json', toPost);
    };
}]);