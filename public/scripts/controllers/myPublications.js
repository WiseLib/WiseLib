'use strict';
angular.module('publication')

.controller('myPublicationsController', function($scope, $window, Page, Publication, $mdDialog, $mdToast, Person) {
    Page.setTitle('My publications');
    $scope.error = null;
    $scope.publications = [];
    $scope.showLoading = true;

    var token = $window.sessionStorage.token;
    var user = JSON.parse(atob(token.split('.')[1]));

    console.log('user: ' + JSON.stringify(user));
    Person.publications({id: user.person}, function(data) {
        $scope.showLoading = false;
        if(data.publications.length > 0) {
            $scope.publications = data.publications;
        } else {
            $scope.error = 'No publications found';
        }
    }, function(error) {
        $scope.error = error.status + ' ' + error.statusText;
    });

    $scope.deletePublication = function(pub) {
      var confirm = $mdDialog.confirm()
        .title('Do you really want to remove this publication?')
        .content('You can\'t undo this.')
        .ariaLabel('Remove publication dialog')
        .ok('Remove')
        .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      Publication.delete({id: pub.id}, function() {
        for (var i = $scope.publications.length - 1; i >= 0; i--) {
          if($scope.publications[i].id === pub.id) {
            $scope.publications.splice(i,1);
            break;
          }
        }
        $mdToast.show({
                    controller: 'ToastCtrl',
                    templateUrl: '../views/feedback-toast.html',
                    hideDelay: 6000,
                    position: 'top right',
                    locals: {text: 'Publication succesfully removed',
                        error: false}
                });

      }, function(data) {
        $mdToast.show({
                    controller: 'ToastCtrl',
                    templateUrl: '../views/feedback-toast.html',
                    hideDelay: 6000,
                    position: 'top right',
                    locals: {text: 'Error removing publication: ' + data.error,
                        error: true}
                });
      });
    }, function() {
      console.log('Clicked cancel!');
    });
    };

    // $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
    //                      {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});
