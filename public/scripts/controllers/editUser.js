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
        console.log('going to update with form: ' + JSON.stringify(form));
        service.put({id: form.id}, form,
        function() { //Success
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Saved changes',
                         error: false}
            });
        },
        function(data) { //Error
            $mdToast.show({
                controller: 'ToastCtrl',
                templateUrl: '../views/feedback-toast.html',
                hideDelay: 6000,
                position: 'top right',
                locals: {text: 'Error: ' + data.error,
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
        $scope.personEditForm.id = user.person;
        $scope.update(filterEmpty($scope.personEditForm), Person);
    };
});