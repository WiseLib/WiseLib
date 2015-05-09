'use strict';
angular.module('publication')

.controller('myPublicationsController', function($scope, $translate, Page, Publication, $mdDialog, Person, TokenService, ToastService) {
    $translate('MY_PUBLICATIONS').then(function(translated) {
        Page.setTitle(translated);
    });
    var user;
    $scope.error = null;
    $scope.publications = [];
    $scope.showLoading = true;
    try {
    user = TokenService.getUser();
    } catch(error) {
        $translate('LOGGED_IN_VIEW_REQUIREMENT').then(function(translated) {
            $scope.error = translated;
        });
        $scope.showLoading = false;
        return;
    }
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
        $scope.error = error.status + ' ' + error.text;
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
            ToastService.showToast(translated, false);
        });

      }, function(data) {
        $translate('ERROR_REMOVING_PUBLICATION').then(function(translated) {
            ToastService.showToast(translated + ': ' + data.text, true);
        });
      });
    }, function() {
      console.log('Clicked cancel!');
    });
    };
});
