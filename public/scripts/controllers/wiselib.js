'use strict';
module = angular.module("wiselib", []);

module.factory('fetcher', ['$http', function($http) {

    var isEqual = function(obj1, obj2) {
        return obj1 === obj2;
    };

    var fetchForPath = function(path, params) {
        var query = '';
        for(var variable in params) {
            if(query === '') {
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
    var fetchForClass = function(className, params) {
        if((typeof classes[className] === 'undefined') || !isEqual(classesParams[className], JSON.stringify(params))) {
            classes[className] = [];
            classesParams[className] = JSON.stringify(params);
            var path = '/' + className.toLowerCase() + 's.json';
            return fetchForPath(path, params).then(function(response) {
                classes[className] = response.data;
                return classes[className];
            });
        }
        return classes[className];
    };

    var fetchDisciplines = function(params) {
        return fetchForClass('Discipline', params).disciplines;
    };
    var fetchPersons = function(params) {
        //for now, return dummy data
        /*
        if(!isEqual(classesParams['Person'], params)) {
        classes['Person'] = [ {
            id: 1,
            firstName: 'Mathieu',
            lastName: 'Reymond'
        },
        {
            id: 2,
            firstName: 'Wout',
            lastName: 'Van Riel'
        }];
        classesParams['Person'] = params;}
        return classes['Person'];*/
        return fetchForClass('Person', params).persons;
    };
    var fetchProceedings = function(params) {
        //for now, return dummy data
        if(!isEqual(classesParams.Proceeding, params)) {
            classes.Proceeding = [ {
                id: 1,
                name: 'first proceeding',
                rank: 12.3
            },
        {
                id: 2,
                name: 'second proceeding',
                rank: 11.2
            }];
            classesParams.Proceeding = params;
        }
        return classes.Proceeding;
        //return fetchForClass('Proceeding', params);
    };
    var fetchJournals = function(params) {
        return fetchForClass('Journal', params).journals;
    };

    return {
        fetchDisciplines : fetchDisciplines,
        fetchPersons : fetchPersons,
        fetchProceedings : fetchProceedings,
        fetchJournals : fetchJournals
    };
}]);
module.controller("uploadPublicationController", ['fetcher', function(fetcher) {
    this.authors = [];
    this.disciplines = [];
    this.test = function () {alert('test')};
    this.fetcher = fetcher;
    
    this.add = function(array, element) {
        if(array.indexOf(element) === -1) {
            array.push(element);
            console.log('added ' + JSON.stringify(element) + ' to ' + JSON.stringify(array));
        }
        console.log('called add with ' + JSON.stringify(element) + ' and ' + JSON.stringify(array));
    };
    
    this.remove = function(array, element) {
        var i = this.authors.indexOf(element);
        if(i > -1) {
            this.authors.splice(i, 1);
            console.log('removed ' + JSON.stringify(element) + ' from ' + JSON.stringify(array));
        }
        console.log('called remove with ' + JSON.stringify(element) + ' and ' + JSON.stringify(array));
    };

    this.post = function() {
        var toPost = {};
        toPost.title = this.title;
        toPost.numberOfPages = this.numberOfPages;
        toPost.year = this.year;
        toPost.url = this.url;
        var discArray = new Array(this.disciplines.length);
        for(var i = 0; i < this.disciplines.length; i++) {
            discArray[i] = {id: this.disciplines[i].id};
        }
        var authArray = new Array(this.authors.length);
        for(i = 0; i < this.authors.length; i++) {
            authArray[i] = {id: this.authors[i].id};
        }
        toPost.disciplines = discArray;
        toPost.authors = authArray;
        toPost.type = this.type;
        if(this.type === 'Journal') {
            toPost.JournalId = this.journal.id;
            toPost.volume = this.volume;
            toPost.number = this.number;
        }
        else {
            toPost.proceedingId = this.proceeding.id;
            toPost.editors = this.editors;
            toPost.publisher = this.publisher;
            toPost.city = this.city;
        }
        console.log('POST : ' + JSON.stringify(toPost));
    };
}]);
module.directive('personmin', function() {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        person: '=person'
    };

    directive.templateUrl = './views/person-min.html';
    return directive;
});
module.directive('proceedingmin', function() {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        proceeding: '=proceeding'
    };

    directive.templateUrl = './views/proceeding-min.html';
    return directive;
});