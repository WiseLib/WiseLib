var module = angular.module("wiselib");

module.controller("PublicationController", ["fetcher", function(fetcher) {
    this.authors = [];
    this.disciplines = [];
    
    this.fetcher = fetcher;
    
    this.addAuthor = function(person) {
        this.authors.push(person);
    }
    
    this.removeAuthor = function(person) {
        var i = this.authors.indexOf(person);
        if(i > -1) {
            this.authors.splice(i, 1);
        }
    }
    
    this.addDiscipline = function(discipline) {
        this.disciplines.push(discipline);
    }
    
}]);
module.directive('personmin', function() {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        person: '=person'
    };

    directive.templateUrl = "person-min.html";
    return directive;
});