'use strict';

angular.module('client', ['ngMaterial', 'ngRoute', 'publication', 'ngResource', 'user', 'person', 'ngCookies', 'pascalprecht.translate', 'ngStorage'])

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
    .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'searchPublicationController'
    })
    .when('/mypublications', {
        templateUrl: 'views/myPublications.html',
        controller: 'myPublicationsController'
    })
    .when('/publications/:id', {
        templateUrl: 'views/publication.html',
        controller: 'publicationController'
    })
    .when('/persons/:id', {
        templateUrl: 'views/person.html',
        controller: 'personController'
    })
    .otherwise({redirectTo: '/'});
}])

.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/lang/',
      suffix: '.json'
  });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
}])

.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    '**'
    ]);
})

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

.controller('navController', function($scope, $mdSidenav, $translate, Page, AuthenticationService, TokenService) {
    $scope.Page = Page;
    $scope.auth = AuthenticationService;

    $scope.$watch(function(){return AuthenticationService.isAuthenticated;},function(){//set personId on login
        if(AuthenticationService.isAuthenticated){
            var user = TokenService.getUser();
            $scope.personId = user.person;
        }
    });

    $scope.ToggleMenu = function() {
        $mdSidenav('left').toggle();
    };

    $scope.logout = function() {
        AuthenticationService.isAuthenticated = false;
        TokenService.deleteToken();
    };

    $scope.changeLanguage = function(lang) {
        $translate.use(lang);
        $mdSidenav('left').toggle();
    };
})

.controller('mainController', function (Page) {
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
