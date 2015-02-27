'use strict';
var app = angular.module('client', ['ngMaterial', 'ngRoute', 'addUser', 'publication', 'loginUser', 'ngResource', 'user', 'person']);
/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // use the HTML5 History API & set HTM5 mode true
    $locationProvider.html5Mode(true);
    $routeProvider
    // Home
    .when('/', {templateUrl: 'views/start.html', controller: 'mainController'})
    .when('/register', {templateUrl: 'views/register.html', controller: 'manageUserController'})
    .when('/upload', {templateUrl: 'views/upload.html', controller: 'uploadPublicationController'})
    .when('/login', {templateUrl: 'views/loginUser.html', controller: 'loginUserController'})
    .otherwise({redirectTo: '/'});
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.factory('Page', function(){
    var title = '';
    return {
        title: function() {return title; },
        setTitle: function(newTitle) {title = newTitle; }
    };
});

app.controller('navController', function($scope, $window, $mdSidenav, Page, AuthenticationService) {
    $scope.Page = Page;
    $scope.auth = AuthenticationService;
    $scope.ToggleMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.logout = function() {
        AuthenticationService.isAuthenticated = false;
        delete $window.sessionStorage.token;
    };
});
app.controller('mainController', function ($scope, $http, Page) {
    Page.setTitle('Start');
    $scope.response = '';
    $http({url: '/restricted.json', method: 'GET'})
    .success(function (data, status, headers, config) {
        $scope.response = data.feedback;
    });
});

app.controller('ToastCtrl', function($scope, $mdToast, text, error) {
    $scope.content = text;
    $scope.textColor = error ? 'FF0000' : '00FF00';
    $scope.buttonClass = error ? 'md-warn' : 'md-success';
    $scope.closeToast = function() {
        $mdToast.hide();
    };
});
