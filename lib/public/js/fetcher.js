var module = angular.module("wiselib", []);

module.factory("fetcher", function() {

    var fetch = function(path) {
        var json = {
            disciplines: [
                {
                    id:1,
                    name: "Computer Science",
                    parentId:1
                },
                {
                    id:2,
                    name: "Artificial Intelligence",
                    parentId:1
                }
            ]
        }
        return json;
    };
    var disciplines = null;
    var fetchDisciplines = function() {
        if(disciplines == null) {
            var json = fetch("publications.json");
            disciplines = Discipline.parse(json);
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
});