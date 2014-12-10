var app = angular.module('client', ['ngRoute', 'addUser', 'publication']);
/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider
    // Home
    .when('/', {templateUrl: 'views/start.html', controller: 'mainController'})
    .when('/adduser', {templateUrl: 'views/register.html', controller: 'manageUserController'})
    .when('/upload', {templateUrl: 'views/upload.html', controller: 'uploadPublicationController as publication'})
    .otherwise({redirectTo: '/'});
}]);

app.controller('mainController', function ($scope, $http) {
    'use strict';
    $http.get('/api/test')
        .success(function (data) {
            console.log('got data: ' + data);
            $scope.response = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
});