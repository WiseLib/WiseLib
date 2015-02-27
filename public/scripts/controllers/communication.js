'use strict';
module = angular.module('communication', []);
module.factory('fetcher', ['$http', function ($http) {

    var fetchForPath = function (path, params) {
        var query = '';
        for (var variable in params) {
            if (query === '') {
                query += '?';
            }
            else {
                query += '&';
            }
            query += variable + '=' + params[variable];
        }
        return $http.get(path + query);
    };
    /**
     * for each core class object :
     * contains an array of previously fetched objects
     */
     var classes = {};
    /**
     * for each core class object :
     * contains the params of previous fetch operation
     */
     var classesParams = {};
    /**
     * fetch JSON for a core class object according to params
     * Only fetch when params are different than previous request
     */
     var fetchForClass = function (className, params) {
        if ((typeof classes[className] === 'undefined') || classesParams[className] !== JSON.stringify(params)) {
            classes[className] = [];
            classesParams[className] = JSON.stringify(params);
            var path = '/' + className.toLowerCase() + 's.json';
            fetchForPath(path, params).success(function (data, status, headers, config) {
                classes[className] = data;
                return data;
            });
        }
        return classes[className];
    };

    var fetchDisciplines = function (params) {
        return fetchForClass('Discipline', params).disciplines;
    };
    var fetchPersons = function (params) {
        if(params !== undefined){
            return fetchForClass('Person', params).persons;}
        };

var dummydata = [ {//outside of fetchProceeding to prevent infinite digest error
            id: 1,
            name: 'first proceeding',
            rank: 12.3
        },
        {
            id: 2,
            name: 'second proceeding',
            rank: 11.2
        }];

var fetchProceedings = function (params) {
        //for now, return dummy data

        if (classesParams.Proceeding !== JSON.stringify(params)) {
          classes.Proceeding = dummydata;
        //classesParams.Proceeding = params;
    }
    return classes.Proceeding;
        //return fetchForClass('Proceeding', params);
};

    var fetchJournals = function (params) {
        if(params){
            params= {name:params.name};
            var journals = fetchForClass('Journal', params);
        return journals.journals;
        }
    };

    return {
        fetchDisciplines : fetchDisciplines,
        fetchPersons : fetchPersons,
        fetchProceedings : fetchProceedings,
        fetchJournals : fetchJournals
    };
}]);