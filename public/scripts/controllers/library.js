'use strict';
angular.module('publication')

.controller('myLibraryController', function($scope, $translate, Page, Publication, $mdDialog, User, TokenService, ToastService) {
    $translate('MY_LIBRARY').then(function(translated) {
        Page.setTitle(translated);
    });
    $scope.error = null;
    $scope.publications = [];
    $scope.showLoading = true;
    $scope.user = TokenService.getUser();

    User.library({id: $scope.user.id}, function(data) {
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
        $translate(['REMOVE_PUBLICATION_CONFIRM_TITLE', 'CANT_UNDO', 'REMOVE_PUBLICATION_DIALOG', 'REMOVE', 'CANCEL'])
        .then(function(translations) {
            var confirm = $mdDialog.confirm()
            .title(translations.REMOVE_PUBLICATION_CONFIRM_TITLE)
            .content(translations.CANT_UNDO)
            .ariaLabel(translations.REMOVE_PUBLICATION_DIALOG)
            .ok(translations.REMOVE)
            .cancel(translations.CANCEL);
            return $mdDialog.show(confirm);
        })
        .then(function() {
            var removeIndex;
            for (var i = $scope.user.library.length - 1; i >= 0; i--) { 
                if($scope.user.library[i].id === pub.id) {
                    //change library list for put request
                    removeIndex = i;
                    $scope.user.library.splice(i,1);
                    break;
                }
            }
            var user = {id: $scope.user.id, library: $scope.user.library};
            User.put(user, function() {
                //Remove publication from list
                $scope.publications.splice(removeIndex,1);
                $translate('SUCCESFULLY_REMOVED_PUBLICATION').then(function(translated) {
                    ToastService.showToast(translated, false);
                });

            }, function(data) {
                //revert library back to original state
                $scope.user.library.splice(removeIndex,0, {id: pub.id});
                $translate('ERROR_REMOVING_PUBLICATION').then(function(translated) {
                    ToastService.showToast(translated + ': ' + data.error, true);
                });
            });
        }, function() {
            console.log('Clicked cancel!');
        });
    };
});
