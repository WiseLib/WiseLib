'use strict';
var module = angular.module('publication');

module.controller('uploadPublicationController', function($scope, $http, $translate,$location,Page, Person, PersonState, Journal, Proceeding, Publication, UnknownPublication, TokenService, ToastService) {

    Page.setTitleTranslationKey('UPLOAD_PUBLICATION');

    try {
        var user = TokenService.getUser();
    } catch(error) {
        $translate('LOGGED_IN_VIEW_REQUIREMENT').then(function(translated) {
            $scope.error = translated;
        });
        return;
    }

    $scope.newPublication={};
    $scope.authors = [];
    $scope.pdfAuthors =[];
    $scope.disciplines = [];
    $scope.references = [];
    $scope.unknownpublications=[];
    $scope.searchJournal={};
    $scope.searchProceeding={};
    $scope.PersonState = PersonState;
    $scope.knownreferences=[];
    $scope.unknownreferences=[];

    $scope.$watch('newPublication.title', function () {
        $scope.searchUnknownPublications($scope.newPublication.title);
    });

    $scope.searchUnknownPublications = function(title){
        if(title === undefined || title.length < 4){
            $scope.unknownpublications=[];
            return;}
        UnknownPublication.search({q:title},function(data){
            $scope.unknownpublications = data.publications;
        },function(){});
    };

    var lastSearch;
    var persons = [];

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
    };

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
        $scope.searchJournal.value='';
        $scope.journal = jour;
        $scope.type ='Journal';
    };

    $scope.chooseProceeding = function(proc){
        $scope.searchProceeding.value='';
        $scope.proceeding = proc;
        $scope.type = 'Proceeding';
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

            $scope.newPublication.title = data.title;
            $scope.newPublication.numberOfPages=data.numberofpages;
            $scope.newPublication.url = data.path;

            $scope.authors = [];
            Person.query({id:user.person},function(person){
                $scope.add($scope.authors,person.persons[0])
            },function(data){$scope.showSimpleToast("error")});

            $scope.pdfAuthors = data.authors;
            if($scope.pdfAuthors.length > 0) {
                $scope.setCurrentAuthor($scope.pdfAuthors[0]);
            }

        }).
        error(function(data) {
            $translate('UPLOADED_FILE_NOT_PDF').then(function(translated) {
                ToastService.showToast(translated + ': ' + data.statusText, true);
            });
        });
    };

    $scope.uploadbibtex = function(files){

        var fd = new FormData();
        fd.append('file', files[0]);

        $http.post('uploadfile', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).
        success(function(data) {

            var index;
            for (index = 0; index < data.references.length; index++) {
                var knownreference = data.references[index];
                $scope.add($scope.knownreferences,knownreference);
            }
            for (index = 0; index < data.unknownReferences.length; index++) {
                var unknownreference = data.unknownReferences[index];
                $scope.add($scope.unknownreferences, unknownreference);
            }
        }).
        error(function(data) {
            $translate('UPLOADED_FILE_NOT_BIBTEX').then(function(translated) {
                ToastService.showToast(translated + ': ' + data.statusText, true);
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
            //console.log('POST to('+user.id +'): ' + JSON.stringify(toPost));
            Publication.save(JSON.stringify(toPost),function(data){
                var index;
                for(index = 0; index < $scope.unknownreferences.length; index++) {
                    $scope.unknownreferences[index].reference = data.id;
                    UnknownPublication.save(JSON.stringify($scope.unknownreferences[index]), function(data) {});
                }
                $location.path('/mypublications');
            },function(data){
                $translate('ERROR').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.statusText, true);
                });
            });
        }

        var toPost = {};
        toPost.title = $scope.newPublication.title;
        toPost.numberOfPages = $scope.newPublication.numberOfPages;
        toPost.year = $scope.newPublication.year;
        toPost.url = $scope.newPublication.url;
        toPost.abstract = $scope.newPublication.abstract;
        toPost.references = $scope.knownreferences;
        toPost.type = $scope.type;
        if ($scope.type === 'Journal') {
            toPost.journal = $scope.journal.id;
            toPost.volume = $scope.newPublication.volume;
            toPost.number = $scope.newPublication.number;
        }
        else {
            toPost.proceedingId = $scope.proceeding.id;
            toPost.editors = $scope.newPublication.editors;
            toPost.publisher =$scope.newPublication.publisher;
            toPost.city = $scope.newPublication.city;
        }

        toPost.uploader = user.id;
        toPost.authors=[];

        toPost.UnknownPublicationsToDelete=[];

        for (var i = 0; i < $scope.unknownpublications.length; i++) {
            var pub= $scope.unknownpublications[i];
            if(pub.status == undefined || pub.status == false)continue;
            else{
                toPost.UnknownPublicationsToDelete.push(pub);
            }
        }

        for (var i = 0; i < $scope.authors.length; i++) {
            var author = $scope.authors[i];

            if(author.id !== undefined){
                toPost.authors.push({id:author.id});
                if(toPost.authors.length === $scope.authors.length)upload();
            }

            else{
                Person.save(author,function(person){
                    toPost.authors.push({id:person.id});
                    if(toPost.authors.length === $scope.authors.length)upload();
                }, function(data) {
                    $translate('ERROR').then(function(translated) {
                        ToastService.showToast(translated + ': ' + data.statusText, true);
                    });
                });
            }
        }

    };
});
