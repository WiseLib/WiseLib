'use strict';

angular.module('editUser', [])

.controller('updateUserController', function($scope, $window, $location, Page, $mdToast, AuthenticationService, User, Person) {
    Page.setTitle('Update profile');
    $scope.userForm = {};
    $scope.personForm = {};

    //feedback after clicking the submit button
    $scope.successMessage = '';
    $scope.errorMessage = '';

    /**
    * Load image to show preview of profile image to upload and use
    * @param {object} element element which caused the change
    * @return {None}
    */
    $scope.fileNameChanged = function(element) {
        console.log('filename changed');
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log('image loaded');
            $scope.$apply(function() {
                $scope.userForm.profileImageSrc = e.target.result;
            });
        };
        reader.readAsDataURL(element.files[0]);
    };

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

    $scope.updateUser = function() {
        var token = $window.sessionStorage.token;
        var user = JSON.parse(atob(token.split('.')[1]));
        $scope.userForm.id = user.id;
        $scope.update($scope.userForm, User);
    };
    $scope.updatePerson = function() {
        var token = $window.sessionStorage.token;
        var user = JSON.parse(atob(token.split('.')[1]));
        $scope.personForm.id = user.personId.id;
        $scope.update($scope.personForm, Person);
    };

});
