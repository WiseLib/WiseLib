var Discipline = require('./discipline.js');
var Journal = require('./journal.js');
var Proceeding = require('./proceeding.js');

var DBManager = require('./dbmanager.js');
var Config = require('./config.js');

var JSONManager = function() {};

JSONManager.generateDiscipline = function(discipline) {
	return {id: discipline.id, parentId: discipline.parent.id};
};

JSONManager.parseDiscipline = function(jsonExp) {
	var jsonDis = jsonExp.disciplines;
    var disObj = {};
    var disArr = [];
    //first create all the disciplines
    for(var i = 0; i < jsonDis.length; i++) {
        var id = jsonDis[i].id;
        var dis = new Discipline(id);
        disObj[dis.id] = dis;
        disArr.push(dis);
    }
    //then add all the children
    for(var i = 0; i < jsonDis.length; i++) {
        var id = jsonDis[i].id;
        var parentId = jsonDis[i].parentId;
        disObj[parentId].addChild(disObj[id]);
    }
    return disArr;
};

JSONManager.generateJournal = function(journal) {
	var disc = [];
    for(var i = 0; i < journal.disciplines.length; i++) {
        disc.push({id: journal.disciplines[i].id});
    }
    return {id: journal.id, rank: journal.rank, disciplines: disc};
};

JSONManager.parseJournal = function(jsonExp, next) {
	jsonObj = JSON.parse(jsonExp);
	var manager = new DBManager(Config);
	//get all disciplines
	manager.getDisciplines(function(disciplines) {
		var journal = new Journal(jsonObj.id, jsonObj.rank, []);
		//add disciplines to journal
		for(var i = 0; i < jsonObj.disciplines.length; i++) {
			for(var j = 0; j < disciplines.length; j++) {
				if (jsonObj.disciplines[i].id == disciplines[j].id) {
					journal.disciplines.push(disciplines[j]);
				};
			}
		}
		//callback
		next(journal);
	});
	
};

JSONManager.generateProceeding = function(proceeding) {
	var disc = [];
    for(var i = 0; i < proceeding.disciplines.length; i++) {
        disc.push({id: proceeding.disciplines[i].id});
    }
    return {id: proceeding.id, rank: proceeding.rank, disciplines: disc};
};

JSONManager.parseProceeding = function(jsonExp, next) {
	jsonObj = JSON.parse(jsonExp);
	var manager = new DBManager(Config);
	//get all disciplines
	manager.getDisciplines(function(disciplines) {
		var proceeding = new Proceeding(jsonObj.id, jsonObj.rank, []);
		//add disciplines to journal
		for(var i = 0; i < jsonObj.disciplines.length; i++) {
			for(var j = 0; j < disciplines.length; j++) {
				if (jsonObj.disciplines[i].id == disciplines[j].id) {
					journal.disciplines.push(disciplines[j]);
				};
			}
		}
		//callback
		next(proceeding);
	});
	
};

module.exports = JSONManager;