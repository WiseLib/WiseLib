'use strict';
var Discipline = require('./discipline.js');
var Album = require('./album.js');
var Journal = require('./journal.js');
var Proceeding = require('./proceeding.js');
var Publication = require('./publication.js');
var Config = require('./config.js');

var JSONManager = function () {};

/**
 * This generate a JSON-object from a specific Discipline object.
 * @param {Person} person - The Person that will be converted in a JSON object.
 * @return {object} A JSON representation of a Person
 * @public
 * @static
 */
JSONManager.generatePerson = function (person) {
	return person;
	//throw Error('not yet implemented');
};

/**
 * This converts a JSON-string to a Person object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Person object.
 * @public
 * @static
 */
JSONManager.parsePerson = function (jsonExp, next) {
	throw Error('not yet implemented');
};

/**
 * This generate a JSON-object from a specific User object.
 * @param {User} user - The User that will be converted in a JSON object.
 * @return {object} A JSON representation of a User
 * @public
 * @static
 */
JSONManager.generateUser = function (user) {
	throw Error('not yet implemented');
};

/**
 * @todo Now needs an array of all disciplines.
 * This converts a JSON-string to a Discipline object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Discipline object.
 * @public
 * @static
 */
JSONManager.parseUser = function (jsonExp, next) {
	throw Error('not yet implemented');
};

/**
 * This generate a JSON-object from a specific Discipline object.
 * @param {Discipline} discipline - The Discipline that will be converted in a JSON object.
 * @return {object} A JSON representation of a Discipline
 * @public
 * @static
 */
JSONManager.generateDiscipline = function (discipline) {
	return {id: discipline.id, name: discipline.name, parentId: discipline.parent.id};
};

/**
 * @todo Now needs an array of all disciplines.
 * This converts a JSON-string to a Discipline object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Discipline object.
 * @public
 * @static
 */
JSONManager.parseDiscipline = function (jsonExp, next) {
	var jsonObj = JSON.parse(jsonExp);
	var jsonDis = jsonObj.disciplines;
    var disObj = {};
    var disArr = [];
    //first create all the disciplines
    for (var i = 0; i < jsonDis.length; i++) {
        var id = jsonDis[i].id;
        var dis = new Discipline(jsonDis[i].name);
        dis.id = id;
        disObj[dis.id] = dis;
        disArr.push(dis);
    }
    //then add all the children
    for (var i = 0; i < jsonDis.length; i++) {
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
JSONManager.generateAlbum = function (album) {
	var disc = [];
    for (var i = 0; i < album.disciplines.length; i++) {
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
JSONManager.parseAlbum = function (jsonExp, next) {
	var jsonObj = JSON.parse(jsonExp);
	var manager = new DBManager(Config);
	//get all disciplines
	manager.getDiscipline({}, function (disciplines) {
		var album = new Album(jsonObj.name, jsonObj.rank, []);
		album.id = jsonObj.id;
		//add disciplines to album
		for (var i = 0; i < jsonObj.disciplines.length; i++) {
			for (var j = 0; j < disciplines.length; j++) {
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
JSONManager.generateJournal = function (journal) {
	return JSONManager.generateAlbum(journal);
};

/**
 * This converts a JSON-string to a Journal object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Journal object.
 * @public
 * @static
 */
JSONManager.parseJournal = function (jsonExp, next) {
	JSONManager.parseAlbum(jsonExp, next);
};

/**
 * This generate a JSON-object from a specific Proceeding object.
 * @param {object} proceeding - The Proceeding that will be converted in a JSON object.
 * @public
 * @static
 */
JSONManager.generateProceeding = function (proceeding) {
	return JSONManager.generateAlbum(proceeding);
};

/**
 * This converts a JSON-string to a Proceeding object.
 * @param {string} jsonExp - The JSON-string that will be converted to a Proceeding object.
 * @public
 * @static
 */
JSONManager.parseProceeding = function (jsonExp, next) {
	JSONManager.parseAlbum(jsonExp, next);
};

JSONManager.generatePublication = function (publication) {
	var auth = [];
	var disc = [];
	var key = [];
	for (var i = 0; i < publication.authors.length; i++) {
		auth.push({id: publication.authors[i].id});
	}
	for (var i = 0; i < publication.disciplines.length; i++) {
		disc.push({id: publication.disciplines[i].id});
	}
	for (var i = 0; i < publication.keywords.length; i++) {
		key.push({keyword: publication.keywords[i].id});
	}
	return {id: publication.id, title: publication.title,
		      numberOfPages: publication.numberOfPages, year: publication.year,
					url: publication.url, authors: auth, disciplines: disc, keywords: key};
};

JSONManager.parsePublication = function (jsonExp, next) {
		var obj = JSON.parse(jsonExp);
	    var manager = DBManager(Config);
		//Make an object publication (not the class publication);
		var publicationObj = {title: obj.title, numberOfPages: obj.numberOfPages, year: obj.year, url: obj.url, keywords: []};
        //run with a for loop over all the keywords and remove tag 'keyword'
		for (var i = 0; obj.keywords.length; i++){
			publication.keywords.push(obj.keywords[i].keyword);
		}
		//get discipline and person classes from database
		manager.getDisciplines({}, function (disciplines) {
			publicationObj.disciplines = [];
			for (var i = 0; i < obj.disciplines.length; i++) {d
				for (var j = 0; j < disciplines.length; j++) {
					if (jsonObj.disciplines[i].id === disciplines[j].id) {
						publicationObj.disciplines.push(disciplines[j]);
					}
				}
			}
			manager.getPerson({}, function (persons) {
				publicationObj.authors = [];
				for (var i = 0; i < obj.authors.length; i++) {
					for (var j = 0; j < persons.length; j++) {
						if (obj.authors[i].id === persons[j].id) {
							publicationObj.authors.push(persons[j]);
						}
					}
				}
				//make the publication class with the data
				var pubClass = new Publication(publicationObj);
				pubClass.id = obj.id;
				next(pubClass);
			});
		});
    };

JSONManager.generateProceedingPublication = function (ProcPub) {
	var publication = JSONManager.generatePublication(ProcPub);
	publication.conferenceId = ProcPub.conferenceID;
	publication.editors = ProcPub.editor;
	publication.publisher = ProcPub.publisher;
	publication.city = ProcPub.city;
	return publication;
};

JSONManager.parseProceedingPublication = function (jsonExp, next) {
		var jsonObj = JSON.parse(jsonExp);
        var proceeding = null;
	    JSONManager.parsePublication(jsonExp, function (publication) {
		    proceeding = publication;
	    });
		proceeding.editors = jsonObj.editors;
		proceeding.publisher = jsonObj.publisher;
		proceeding.city = jsonObj.city;
		var proceedingClass = new ProceedingPublication(proceeding);
		proceedingClass.conferenceId = jsonObj.conferenceId;
		next(proceedingClass);
    };

JSONManager.generateJournalPublication = function (JourPub) {
	var publication = JSONManager.generatePublication(JourPub);
	publication.journalId = JourPub.journalID;
	publication.volume = JourPub.volume;
	publication.number = JourPub.number;
	return publication;
};

JSONManager.parseJournalPublication = function (jsonExp, next) {
	var jsonObj = JSON.parse(jsonExp);
	var journal = null;
	JSONManager.parsePublication(jsonExp, function (publication) {
		journal = publication;
	});
	journal.volume = jsonObj.volume;
	journal.number = jsonObj.number;
	var journalClass = new JournalPublication(journal);
	journalClass.journalId = jsonObj.journalId;
	next(journalClass);
};
module.exports = JSONManager;
