'use strict';

angular.module('user')

.controller('updateUserController', function($scope, $window, $location, Page, $mdToast, AuthenticationService, User, Person) {
    Page.setTitle('Update profile');
    $scope.userEditForm = {};
    $scope.personEditForm = {};

    /**
   * Sends a request to the server to register a user using form input
   * @return {None}
   */
    $scope.update = function (form, service) {
        service.put(form,
        function(data) { //Success
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Saved Changes',
                         error: false}
            });
        }, 
        function(data) { //Error
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Error: ' + data,
                         error: true}
            });
        });
    };

    function filterEmpty(obj) {
        for(var key in obj) {
            if(!obj[key]) {
                delete obj[key];
            }
        }
        console.log('going to return' + JSON.stringify(obj));
        return obj;
    }

    $scope.updateUser = function() {
        console.log(JSON.stringify($scope.userEditForm));
        var token = $window.sessionStorage.token;
        var user = JSON.parse(atob(token.split('.')[1]));
        $scope.userEditForm.id = user.id;
        $scope.update(filterEmpty($scope.userEditForm), User);
    };
    $scope.updatePerson = function() {
        var token = $window.sessionStorage.token;
        var user = JSON.parse(atob(token.split('.')[1]));
        $scope.personEditForm.id = user.personId.id;
        $scope.update(filterEmpty($scope.personEditForm), Person);
    };
});