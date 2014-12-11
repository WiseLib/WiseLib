'use strict';
var Discipline = require('./discipline.js');
var Album = require('./album.js');
var Journal = require('./journal.js');
var Proceeding = require('./proceeding.js');
var Publication = require('./publication.js');
var DBManager = require('./dbmanager.js');
var Config = require('./config.js');

var JSONManager = function() {};
var dbManager = new DBManager(Config.database);

/**
 * This generate a JSON-object from a specific Discipline object.
 * @param {Person} person - The Person that will be converted in a JSON object.
 * @return {object} A JSON representation of a Person
 * @public
 * @static
 */
JSONManager.generatePerson = function(person) {
	return person;
	//throw Error('not yet implemented');
};

/**
 * This converts a JSON-string to a Person object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Person object.
 * @public
 * @static
 */
JSONManager.parsePerson = function(jsonExp, next) {
	throw Error('not yet implemented');
};

/**
 * This generate a JSON-object from a specific User object.
 * @param {User} user - The User that will be converted in a JSON object.
 * @return {object} A JSON representation of a User
 * @public
 * @static
 */
JSONManager.generateUser = function(user) {
	throw Error('not yet implemented');
};

/**
 * @todo Now needs an array of all disciplines.
 * This converts a JSON-string to a Discipline object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Discipline object.
 * @public
 * @static
 */
JSONManager.parseUser = function(jsonExp, next) {
	throw Error('not yet implemented');
};

/**
 * This generate a JSON-object from a specific Discipline object.
 * @param {Discipline} discipline - The Discipline that will be converted in a JSON object.
 * @return {object} A JSON representation of a Discipline
 * @public
 * @static
 */
JSONManager.generateDiscipline = function(discipline) {
	return {id: discipline.id, name: discipline.name, parentId: discipline.parent.id};
};

/**
 * @todo Now needs an array of all disciplines.
 * This converts a JSON-string to a Discipline object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Discipline object.
 * @public
 * @static
 */
JSONManager.parseDiscipline = function(jsonExp, next) {
	var jsonObj = JSON.parse(jsonExp);
	var jsonDis = jsonObj.disciplines;
    var disObj = {};
    var disArr = [];
    //first create all the disciplines
    for(var i = 0; i < jsonDis.length; i++) {
        var id = jsonDis[i].id;
        var dis = new Discipline(jsonDis[i].name);
        dis.id = id;
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

/**
 * This generate a JSON-object from a specific Album object.
 * @param {object} album - The Album that will be converted in a JSON object.
 * @public
 * @static
 */
JSONManager.generateAlbum = function(album) {
	var disc = [];
    for(var i = 0; i < album.disciplines.length; i++) {
        disc.push({id: album.disciplines[i].id});
    }
    return {id: album.id, name: album.name, rank: album.rank, disciplines: disc};
};

/**
 * This converts a JSON-string to an Album object.
 * @param {string} jsonExp - The JSON-string that will be converted to an Album object.
 * @public
 * @static
 */
JSONManager.parseAlbum = function(jsonExp, next) {
	var jsonObj = JSON.parse(jsonExp);
	var manager = new DBManager(Config);
	//get all disciplines
	manager.getDiscipline({}, function(disciplines) {
		var album = new Album(jsonObj.name, jsonObj.rank, []);
		album.id = jsonObj.id;
		//add disciplines to album
		for(var i = 0; i < jsonObj.disciplines.length; i++) {
			for(var j = 0; j < disciplines.length; j++) {
				if (jsonObj.disciplines[i].id === disciplines[j].id) {
					album.disciplines.push(disciplines[j]);
				}
			}
		}
		//callback
		next(album);
	});

};

/**
 * This generate a JSON-object from a specific Journal object.
 * @param {object} journal - The Journal that will be converted in a JSON object.
 * @public
 * @static
 */
JSONManager.generateJournal = function(journal) {
	return JSONManager.generateAlbum(journal);
};

/**
 * This converts a JSON-string to a Journal object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Journal object.
 * @public
 * @static
 */
JSONManager.parseJournal = function(jsonExp, next) {
	JSONManager.parseAlbum(jsonExp, next);
};

/**
 * This generate a JSON-object from a specific Proceeding object.
 * @param {object} proceeding - The Proceeding that will be converted in a JSON object.
 * @public
 * @static
 */
JSONManager.generateProceeding = function(proceeding) {
	return JSONManager.generateAlbum(proceeding);
};

/**
 * This converts a JSON-string to a Proceeding object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Proceeding object.
 * @public
 * @static
 */
JSONManager.parseProceeding = function(jsonExp, next) {
	JSONManager.parseAlbum(jsonExp, next);
};

JSONManager.generatePublication = function(publication){
	var auth = [];
	var disc = [];
	var key = [];
	for(var i = 0; i < publication.authors.length; i++){
		auth.push({id: publication.authors[i].id});
	}
	for(var i = 0; i < publication.disciplines.length; i++){
		disc.push({id: publication.disciplines[i].id});
	}
	for(var i = 0; i < publication.keywords.length; i++){
		key.push({keyword: publication.keywords[i].id});
	}
	return {id: publication.id, title: publication.title,
		      numberOfPages: publication.numberOfPages, year: publication.year,
					url: publication.url, authors: auth, disciplines: disc, keywords: key};
}

JSONManager.parsePublication = function(jsonExp, next) {
	var obj = JSON.parse(jsonExp);
	//var manager = DBManager(Config);
	var manager = dbManager;
	//Make an object publication (not the class publication);
	var publicationObj = {title: obj.title, 
			              numberOfPages: obj.numberOfPages, 
			              year: obj.year, 
			              url: obj.url, 
			              keywords: [], 
			              disciplines : [],
			              authors: []};
	//run with a for loop over all the keywords and remove tag 'keyword'
	for(var i = 0; obj.keywords.length; i++){
		publication.keywords.push(obj.keywords[i].keyword);
	}
	for(var i = 0; i < obj.disciplines.length; i++) {
		console.log('discipline id : ' + obj.disciplines[i].id);
		manager.getDiscipline({id: obj.disciplines[i].id.toString()}, function(disciplines) {
			if(disciplines.length === 0) {
				throw Error('Did not find Discipline with id ' + obj.disciplines[i].id);
			}
			publicationObj.disciplines.push(disciplines[0]);
			console.log('currentDone : ' + currentDone + ' pub(' + disciplines[0].id + ')');
		});
	}
	for(var i = 0; i < obj.authors.length; i++) {
		manager.getPerson({id: obj.authors[i].id}, function(persons) {
			if(persons.length === 0) {
				throw Error('Did not find Author with id ' + obj.authors[i].id);
			}
			publicationObj.authors.push(persons[0]);
			console.log('currentDone : ' + currentDone + ' pers(' + persons[0].id + ')');
		});
	}
	next(new Publication(publicationObj));
}

JSONManager.generateProceedingPublication = function(ProcPub){
	var publication = JSONManager.generatePublication(ProcPub);
	publication.conferenceId = ProcPub.conferenceID;
	publication.editors = ProcPub.editor;
	publication.publisher = ProcPub.publisher;
	publication.city = ProcPub.city;
	return publication;
}

JSONManager.parseProceedingPublication = function(jsonExp, next){
	var jsonObj = JSON.parse(jsonExp);
    var proceeding = null;
	JSONManager.parsePublication(jsonExp, function(publication){
		proceeding = publication;
		proceeding.editors = jsonObj.editors;
		proceeding.publisher = jsonObj.publisher;
		proceeding.city = jsonObj.city;
		var proceedingClass = new ProceedingPublication(proceeding);
		proceedingClass.conferenceId = jsonObj.conferenceId;
		next(proceedingClass);
	});	
}

JSONManager.generateJournalPublication = function(JourPub){
	var publication = JSONManager.generatePublication(JourPub);
	publication.journalId = JourPub.journalID;
	publication.volume = JourPub.volume;
	publication.number = JourPub.number;
	return publication;
}

JSONManager.parseJournalPublication = function(jsonExp, next){
	var jsonObj = JSON.parse(jsonExp);
	var journal = null;
	JSONManager.parsePublication(jsonExp, function(publication){
		journal = publication;
	});
	journal.volume = jsonObj.volume;
	journal.number = jsonObj.number;
	var journalClass = new JournalPublication(journal);
	journalClass.journalId = jsonObj.journalId;
	next(journalClass);
}
module.exports = JSONManager;
