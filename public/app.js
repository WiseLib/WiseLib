'use strict';

angular.module('client', ['ngMaterial', 'ngRoute', 'publication', 'ngResource', 'user', 'person', 'ngCookies', 'pascalprecht.translate', 'ngStorage', 'toast'])

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
        controller: 'searchPublicationController',
        reloadOnSearch: false
    })
    .when('/mypublications', {
        templateUrl: 'views/publicationsList.html',
        controller: 'myPublicationsController'
    })
    .when('/library', {
        templateUrl: 'views/publicationsList.html',
        controller: 'myLibraryController'
    })
    .when('/network', {
        templateUrl: 'views/network.html',
        controller: 'networkController'
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

.factory('Page', function($translate){
    var title = '';
    var titleTranslationKey = '';
    return {
        title: function() {return title; },
        setTitleTranslationKey: function(newTitle) {
            titleTranslationKey = newTitle;
            $translate(titleTranslationKey).then(function(translated) {
                title = translated;
            });
        },
        translateTitle: function() {
            $translate(titleTranslationKey).then(function(translated) {
                title = translated;
            });
        }
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
        Page.translateTitle();
        $mdSidenav('left').toggle();
    };
})

.controller('mainController', function (Page) {
    Page.setTitleTranslationKey('START');
});
