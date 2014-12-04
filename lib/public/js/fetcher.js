var module = angular.module("wiselib", []);

module.factory("fetcher", ['$http', function($http) {

    var isEqual = function(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    var fetch = function(path, params) {
        var query = '';
        for(variable in params) {
            if(query == '') {
                query += '?';
            }
            else {
                query += '&';
            }
            query += variable + '=' + params.variable;
        }
        return $http.get(path + query);
    };

    var disciplines = null;
    var disciplinesParams = {};
    var fetchDisciplines = function(params) {
        if(disciplines == null || !isEqual(disciplinesParams, params)) {
            disciplines = [];
            return fetch('/disciplines.json', params).then(function(response) {
                disciplines = response.data.disciplines;
                return disciplines;
            });
        }
        return disciplines;
    };
    
    var persons = null;
    var fetchPersons = function(firstname, lastname) {
        if(persons == null) {
            var json = fetch("persons.json?firstname=" + firstname + "&lastname=" + lastname);
            //should return person objects
            json = [
                {
                    firstName:"mathieu",
                    lastName:"reymond"
                },
                {
                    firstName: "wout",
                    lastName: "van riel"
                }
            ];
            
            persons = json
        }
        
        return persons;
    };
    
    return {
        fetchDisciplines : fetchDisciplines,
        fetchPersons : fetchPersons
    };
}]);