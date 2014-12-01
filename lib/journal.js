function Journal(id, rank, disciplines) {
    this.id = id;
    this.name = name;
    this.rank = rank;
    this.disciplines = disciplines;
}

Journal.parse = function(jsonExp, disciplines) {
    var jsonJournals = jsonExp.journals;
    var journals = [];
    //loop through all journals
    for(var i = 0; i < jsonJournals.length; i++) {
        journal = jsonJournals[i];
        journalDisciplines = [];
        //look through all disciplines of current journal (only id's in json)
        for(var j =0; j < journal.disciplines.length; j++) {
            //find discipline corresponding to id
            for(var k = 0; k < disciplines.length; k++) {
                if(disciplines[k].id == journal.disciplines[j].id) {
                    journalDisciplines.push(disciplines[k]);
                }
            }
        }
        journals.push(new Journal(journal.id, journal.rank, journalDisciplines));
        
    }
    
    return journals;
}

Journal.prototype.json = function() {
    var disc = [];
    for(var i = 0; i < this.disciplines.length; i++) {
        disc.push({this.disciplines[i].id});
    }
    return {id: this.id, rank: this.rank, disciplines: disc};
}

//exports
exports.Journal = Journal;
exports.Journal.parse = Journal.parse;
exports.Journal.prototype.json = Journal.prototype.json;