'use strict';

angular.module('client', ['ngMaterial', 'ngRoute', 'addUser', 'addPublication', 'publication', 'loginUser', 'editUser', 'ngResource', 'user', 'person', 'myPublications'])

/**
 * Configure the Routes
 */
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // use the HTML5 History API & set HTM5 mode true
    $locationProvider.html5Mode(true);
    $routeProvider
    // Home
    .when('/', {
        templateUrl: 'views/start.html',
        controller: 'mainController'})
    .when('/register', {
        templateUrl: 'views/register.html', 
        controller: 'registerUserController'
    })
    .when('/update', {
        templateUrl: 'views/updateUser.html', 
        controller: 'updateUserController'
    })
    .when('/upload', {
        templateUrl: 'views/upload.html', 
        controller: 'uploadPublicationController'
    })
    .when('/login', {
        templateUrl: 'views/loginUser.html', 
        controller: 'loginUserController'
    })
    .when('/mypublications', {
        templateUrl: 'views/myPublications.html',
        controller: 'myPublicationsController'
    })
    .otherwise({redirectTo: '/'});
}])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
})

.factory('Page', function(){
    var title = '';
    return {
        title: function() {return title; },
        setTitle: function(newTitle) {title = newTitle; }
    };
})

.controller('navController', function($scope, $window, $mdSidenav, Page, AuthenticationService) {
    $scope.Page = Page;
    $scope.auth = AuthenticationService;
    $scope.ToggleMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.logout = function() {
        AuthenticationService.isAuthenticated = false;
        delete $window.sessionStorage.token;
    };
})

.controller('mainController', function ($scope, $http, Page) {
    Page.setTitle('Start');
})

.controller('ToastCtrl', function($scope, $mdToast, text, error) {
    $scope.content = text;
    $scope.textColor = error ? 'FF0000' : '00FF00';
    $scope.buttonClass = error ? 'md-warn' : 'md-success';
    $scope.closeToast = function() {
        $mdToast.hide();
    };
});
