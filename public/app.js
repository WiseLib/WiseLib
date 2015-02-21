var app = angular.module('client', ['ngMaterial', 'ngRoute', 'addUser', 'publication']);
/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    'use strict';
    // use the HTML5 History API & set HTM5 mode true
    $locationProvider.html5Mode(true);
    $routeProvider
    // Home
    .when('/', {templateUrl: 'views/start.html', controller: 'mainController'})
    .when('/register', {templateUrl: 'views/register.html', controller: 'manageUserController'})
    .when('/upload', {templateUrl: 'views/upload.html', controller: 'uploadPublicationController as publication'})
    .otherwise({redirectTo: '/'});
}]);

app.factory('Page', function(){
    var title = '';
    return {
        title: function() {return title; },
        setTitle: function(newTitle) {title = newTitle; }
    };
});

app.controller('navController', function($scope, $mdSidenav, Page) {
    'use strict';
    $scope.Page = Page;
    $scope.ToggleMenu = function() {
        $mdSidenav('left').toggle();
    };
});
app.controller('mainController', function ($scope, $http, Page) {
        'use strict';
        Page.setTitle('Start');
        $http.get('/api/test')
        .success(function (data) {
            console.log('got data: ' + data);
            $scope.response = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
});