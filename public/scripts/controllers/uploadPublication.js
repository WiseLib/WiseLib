'use strict';
var module = angular.module('publication');

module.controller('uploadPublicationController', function($scope, $window, $http, $translate, Page, $mdToast, Person, PersonState, Journal, Proceeding) {
    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));

    $translate('UPLOAD_PUBLICATION').then(function(translated) {
        Page.setTitle(translated);
    });
    $scope.authors = [];
    $scope.pdfAuthors =[];
    $scope.disciplines = [];
    $scope.references = [];
    $scope.JSONreferences = [];
    $scope.searchJournal;
    $scope.searchProceeding;
    $scope.PersonState = PersonState;

    var lastSearch;
    var persons = [];
    $scope.fetchPersons = function (author){
        if (author === undefined) return [];
        if (JSON.stringify(author) === lastSearch) return persons;
        lastSearch =  JSON.stringify(author);

        var firstName = author.firstName;
        var lastName = author.lastName;

        function returnData(data){
             persons = data.persons;
             return data.persons;
        }
        if(firstName !== undefined && lastName === undefined)Person.searchFirstName({fn:firstName},function(data){returnData(data);},function(data){});
        if(firstName === undefined && lastName !== undefined)Person.searchLastName({ln:lastName},function(data){returnData(data);},function(data){});
        if(firstName !== undefined && lastName !== undefined)Person.searchBoth({fn:firstName,ln:lastName},function(data){returnData(data);},function(data){});
    };

    var proceedings;
    var lastProcSearch;
    $scope.fetchProceedings = function(name){
        if (name === undefined || name.length < 3) return [];
        if (JSON.stringify(name) === lastProcSearch) return proceedings;
        lastProcSearch =  JSON.stringify(name);
        Proceeding.search({q:name},function(data){
            proceedings= data.proceedings;
            return data.proceedings;
        });
    };
    var journals;
    var lastJourSearch;
    $scope.fetchJournals = function (name){
        if (name === undefined || name.length < 3) return [];
        if (JSON.stringify(name) === lastJourSearch) return journals;
        lastJourSearch =  JSON.stringify(name);
        Journal.search({q:name},function(data){
            journals= data.journals;
            return data.journals;
        });
    };

    $scope.addAuthor = function() {
        //copy json object
        var author = JSON.parse(JSON.stringify(PersonState.person));
        //clear person object
        for(var v in PersonState.person) {
            PersonState.person[v] = undefined;
        }
        $scope.add($scope.authors, author);
        //next pdf-extracted author
        $scope.selectCurrentPDFAuthor();
    };

    $scope.skipAuthor = function(){
        //clear person object
        for(var v in PersonState.person) {
            PersonState.person[v] = undefined;
        }
        //next pdf-extracted author
        $scope.selectCurrentPDFAuthor();
    }

    $scope.setCurrentAuthor = function(person) {
        PersonState.person.firstName = person.firstName;
        PersonState.person.lastName = person.lastName;
    };

    $scope.selectCurrentPDFAuthor = function() {
        $scope.pdfAuthors.shift();
        if($scope.pdfAuthors.length > 0) {
            $scope.setCurrentAuthor($scope.pdfAuthors[0]);
        }
    };

    $scope.chooseJournal = function(jour){
        $scope.searchJournal='';
        $scope.journal = jour;
    };

    $scope.chooseProceeding = function(proc){
        $scope.searchProceeding='';
        $scope.proceeding = proc;
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
        success(function(data) {

            $scope.localfile = true;

            $scope.title = data.title;
            $scope.numberOfPages=data.numberofpages;
            $scope.url = data.path;

            $scope.authors = [];
            Person.get({id:user.person},function(person){$scope.add($scope.authors,person)});
            $scope.pdfAuthors = data.authors;
            if($scope.pdfAuthors.length > 0) {
                $scope.setCurrentAuthor($scope.pdfAuthors[0]);
            }   

        }).
        error(function(data, status, headers, config) {
            $translate('UPLOADED_FILE_NOT_PDF').then(function(translated) {
                $scope.showSimpleToast(translated);
            });
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
            $translate('UPLOADED_FILE_NOT_BIBTEX').then(function(translated) {
                $scope.showSimpleToast(translated);
            });
        });
    };

    $scope.postPerson = function(person) {
        var deferred = $q.defer();
        if(person.id) {
            deferred.resolve(person);
        }
        else {
            Person.save(person, function(personData) {
                person.id = personData.id;
                deferred.resolve(person);
            }, function(errorData) {
                deferred.reject(errorData);
            });
        }

        return deferred.promise;
    };

    $scope.post = function () {

        function upload(){
            console.log('POST to('+user.id +'): ' + JSON.stringify(toPost));
        /*  $http.post('users/'+user.id+'/publications.json', toPost)
            .success(function(data, status, headers, config) {
                $location.path('/mypublications') 
            })
            .error(function(data, status, headers, config) {
                $scope.showSimpleToast("Something went wrong:" + status);
            });*/
        };

        var toPost = {};
        toPost.title = $scope.title;
        toPost.numberOfPages = $scope.numberOfPages;
        toPost.year = $scope.year;
        toPost.url = $scope.url;
        toPost.abstract = $scope.abstract;
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

        toPost.uploader = user.id;
        toPost.authors=[];

        for (var i = 0; i < $scope.authors.length; i++) {
            var author = $scope.authors[i];

            if(author.id !== undefined){
                toPost.authors.push(author.id);
                if(toPost.authors.length == $scope.authors.length)upload();
            }

            else{
                Person.save(author,function(person){
                    toPost.authors.push(person.id);
                    if(toPost.authors.length == $scope.authors.length)upload();
                });
            }
        };
    };
});
