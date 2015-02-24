var user = angular.module('user', []);

user.factory('User', function($resource) {
    return $resource('/user.json');
});

user.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false
    }
    return auth;
});
user.factory('UserService', function($http) {
    return {
        logIn: function(email, password) {
            return $http.post('/users/login.json', {email: email, password: password});
        },
        logOut: function() {
        }
    }
});

user.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                console.log('Congrats, you\'re auth\'ed');
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }

            return $q.reject(rejection);
        }
    };
});
