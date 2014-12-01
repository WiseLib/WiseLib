function Proceeding(id, rank, disciplines) {
    this.id = id;
    this.rank = rank;
    this.disciplines = disciplines;
}

Proceeding.parse = function(jsonExp, disciplines) {
    var jsonProceedings = jsonExp.proceedings;
    var proceedings = [];
    //loop through all proceedings
    for(var i = 0; i < jsonProceedings.length; i++) {
        proceeding = jsonProceedings[i];
        proceedingDisciplines = [];
        //look through all disciplines of current proceeding (only id's in json)
        for(var j =0; j < proceeding.disciplines.length; j++) {
            //find discipline corresponding to id
            for(var k = 0; k < disciplines.length; k++) {
                if(disciplines[k].id == proceeding.disciplines[j].id) {
                    proceedingDisciplines.push(disciplines[k]);
                }
            }
        }
        proceedings.push(new Proceeding(proceeding.id, proceeding.rank, proceedingDisciplines));
        
    }
    
    return proceedings;
}

Proceeding.prototype.json = function() {
    var disc = [];
    for(var i = 0; i < this.disciplines.length; i++) {
        disc.push({this.disciplines[i].id});
    }
    return {id: this.id, rank: this.rank, disciplines: disc};
}

//exports
exports.Proceeding = Proceeding;
exports.Proceeding.parse = Proceeding.parse;
exports.Proceeding.prototype.json = Proceeding.prototype.json;