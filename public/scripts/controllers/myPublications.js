'use strict';

angular.module('myPublications', [])

.controller('myPublicationsController', function($scope, $window, Page, Publication, $mdDialog) {
    Page.setTitle('My publications');
    $scope.error = null;

    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));
    Publication.query({id: user.id}, function(data) {
        console.log('got data!');
        console.log(data);
        if(data.publications.length > 0) {
            $scope.publications = data.publications;
        } else {
            $scope.error = 'No publications found';
        }
    }, function(error) {
        console.warn('error:' + error);
        $scope.error = error.statusText;
    });

    $scope.deletePublication = function(ev, pub) {
           var confirm = $mdDialog.confirm()
      .title('Do you really want to remove this publication?')
      .content('You can\'t undo this')
      .ariaLabel('Remove publication dialog')
      .ok('Remove')
      .cancel('Cancel')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      console.log('Clicked ok!');
    }, function() {
      console.log('Clicked cancel!');
    });
    };

    // $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
    //                      {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});
