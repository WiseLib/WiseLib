'use strict';
angular.module('publication')

.controller('myPublicationsController', function($scope, $window, $translate, Page, Publication, $mdDialog, $mdToast, Person) {
    $translate('MY_PUBLICATIONS').then(function(translated) {
    Page.setTitle(translated);
  });
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
            $translate('NO_PUBLICATIONS_FOUND').then(function(translated) {
                $scope.error = translated;
        });
        }
    }, function(error) {
        $scope.error = error.status + ' ' + error.statusText;
    });

    $scope.deletePublication = function(pub) {
        var confirm;
      $translate(['REMOVE_PUBLICATION_CONFIRM_TITLE', 'CANT_UNDO', 'REMOVE_PUBLICATION_DIALOG', 'REMOVE', 'CANCEL']).then(function(translations) {
          confirm = $mdDialog.confirm()
            .title(translations.REMOVE_PUBLICATION_CONFIRM_TITLE)
            .content(translations.CANT_UNDO)
            .ariaLabel(translations.REMOVE_PUBLICATION_DIALOG)
            .ok(translations.REMOVE)
            .cancel(translations.CANCEL);
        });
    $mdDialog.show(confirm).then(function() {
      Publication.delete({id: pub.id}, function() {
        for (var i = $scope.publications.length - 1; i >= 0; i--) { //Remove publication from list
          if($scope.publications[i].id === pub.id) {
            $scope.publications.splice(i,1);
            break;
          }
        }
        $translate('SUCCESFULLY_REMOVED_PUBLICATION').then(function(translated) {
            $mdToast.show({
                        controller: 'ToastCtrl',
                        templateUrl: '../views/feedback-toast.html',
                        hideDelay: 6000,
                        position: 'top right',
                        locals: {text: translated,
                            error: false}
                });
        });

      }, function(data) {
        $translate('ERROR_REMOVING_PUBLICATION').then(function(translated) {
            $mdToast.show({
                        controller: 'ToastCtrl',
                        templateUrl: '../views/feedback-toast.html',
                        hideDelay: 6000,
                        position: 'top right',
                        locals: {text: translated + ': ' + data.error,
                            error: true}
                    });
        });
      });
    }, function() {
      console.log('Clicked cancel!');
    });
    };

    // $scope.publications = [{title: 'Test', publishedInYear: 2014, nrOfPages: 23},
    //                      {title: 'Andere test', publishedInYear: 2015, nrOfPages: 17}];
});
