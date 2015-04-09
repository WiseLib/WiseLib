'use strict';
var module = angular.module('publication');

module.controller('uploadPublicationController', function($scope, fetcher, $window, $http, $translate, Page, $mdToast, Person) {
    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));

    $translate('UPLOAD_PUBLICATION').then(function(translated) {
    Page.setTitle(translated);
  });
    $scope.authors = [];
    $scope.chooseAuthor = [];
    $scope.newAuthors =[];
    $scope.disciplines = [];
    $scope.references = [];
    $scope.JSONreferences = [];
    $scope.fetcher = fetcher;

    $scope.chooseJournal = function(jour){
        $scope.journal = jour;
    }

    $scope.chooseProceeding = function(proc){
        $scope.proceeding = proc;
    }

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

            $scope.authors = [user.person];

            var index;
            for (index = 0; index < data.authors.length; ++index) {

                var firstName = data.authors[index].firstName;
                var lastName = data.authors[index].lastName;

                var foundPersons;

                (function(firstName,lastName){
                    Person.query({firstName: firstName, lastName: lastName}, function(response) {
                        foundPersons = {firstName:firstName,lastName:lastName,authorList:response.persons};
                        if (response.persons.length<1) {//response is empty if person does not exist on server
                            $translate('NAME_WILL_BE_ADDED_TO_DATABASE').then(function(translated) {
                                foundPersons.status= '(' + translated + ')';
                            });
                            $scope.add($scope.authors,foundPersons);
                        }
                        else {
                            $scope.add($scope.chooseAuthor,foundPersons);
                        }
                    }, function(error) {});
                        console.log(error);
                    });
                }(firstName,lastName));

            }   
        }).
error(function(data, status, headers, config) {
    $translate('UPLOADED_FILE_NOT_PDF').then(function(translated) {
        $scope.showSimpleToast(translated);
    });
});

}

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
}



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

var authArray = new Array($scope.authors.length);
        authArray[0] = {id: $scope.authors[0].id};//Uploader
        if($scope.authors.length = 1) {upload();return;} //no other co authors
        for (var i = 1; i < $scope.authors.length; i++) {//add co authors (id) to list

            var author = $scope.authors[i];

            if(author.status){//person not in database

                var affiliation;
                $translate('ENTER_AFFILIATION_FOR').then(function(translated) {
                    affiliation = prompt(translated + ' ' + author.firstName + ' ' + author.lastName);
                });
                var newPerson = new Person({firstName: author.firstName, lastName:author.lastName});

                (function(index){
                    newPerson.$save(function (data){//create new person on server
                       authArray[index]= {id: data.personId};

                       if(index = $scope.authors.length){
                        toPost.authors = authArray;
                        upload();//on success and last author, start the upload
                        return;}

                    },function(data){//error from server
                        $translate('COULD_NOT_ADD_PERSON').then(function(translated) {
                            $scope.showSimpleToast(translated + ': ' + author.firstName + ' ' + author.lastName + status);
                        });
                        return;
                    })
                    
                }(i))

            }

            authArray[i] = {id: author.id};
        }
        
        
    };
});
