'use strict';

angular.module('user')

.factory('User', function($resource) {
    return $resource('/users/:id.json', {id:'@id'}, {
        get: {method: 'GET'},
        put: {method: 'PUT'}
    });
})

.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false
    };
    return auth;
})

.factory('UserService', function($http) {
    return {
        logIn: function(email, password) {
            return $http.post('/login', {email: email, password: password});
        },
        logOut: function() {
        }
    };
})

.factory('TokenService', function($localStorage) {
    return {
        getToken: function() {
            return $localStorage.token;
        },
        getUser: function() {
            var token = this.getToken();
            return JSON.parse(atob(token.split('.')[1]));
        },
        setUser: function(newUser) {
            var token = this.getToken();
            var parts = token.split('.');
            var user = JSON.parse(atob(parts[1]));
            for (var property in newUser) {
                if(newUser.hasOwnProperty(property)) {
                    user[property] = newUser[property];
                }
            }
            parts[1] = btoa(JSON.stringify(user));
            token = parts.join('.');
            this.setToken(token);
        },
        setToken: function(token) {
            $localStorage.token = token;
        },
        deleteToken: function() {
            delete $localStorage.token;
            return true;
        },
    };
})

.factory('TokenInterceptor', function($q, $location, TokenService, AuthenticationService) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            var token = TokenService.getToken();
            if (token) {
                var time = (new Date).getTime() / 1000;
                if(TokenService.getUser().exp > time) { //Check if token isn't expired (=useless) yet
                    config.headers.Authorization = 'Bearer ' + token;
                } else {
                    TokenService.deleteToken();
                    AuthenticationService.isAuthenticated = false;
                }
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function(response) {
            if (response !== null && response.status === 200 && TokenService.getToken() && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            var r = new RegExp('^(?:[a-z]+:)?//', 'i');
            if(r.test(rejection.config.url)) { //Url's starting with http:// for example are extern and are unrelated to authorization with our server
                return $q.reject(rejection);
            }
            if (rejection !== null && rejection.status === 401 && (TokenService.getToken() || AuthenticationService.isAuthenticated)) {
                TokenService.deleteToken();
                AuthenticationService.isAuthenticated = false;
                $location.path('/login');
            }

            return $q.reject(rejection);
        }
    };
});
