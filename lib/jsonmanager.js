'use strict';

var JSONManager = function() {};

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
 * This generate a JSON-object from a specific User object.
 * @param {User} user - The User that will be converted in a JSON object.
 * @return {object} A JSON representation of a User
 * @public
 * @static
 */
JSONManager.generateUser = function(user) {
    throw new Error('not yet implemented');
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
 * This generate a JSON-object from a specific Journal object.
 * @param {object} journal - The Journal that will be converted in a JSON object.
 * @public
 * @static
 */
JSONManager.generateJournal = function(journal) {
    return JSONManager.generateAlbum(journal);
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

JSONManager.generatePublication = function(publication){
    var auth = [];
    var disc = [];
    var key = [];
    for(var i = 0; i < publication.authors.length; i++){
        auth.push({id: publication.authors[i].id});
    }
    for(i = 0; i < publication.disciplines.length; i++){
        disc.push({id: publication.disciplines[i].id});
    }
    for(i = 0; i < publication.keywords.length; i++){
        key.push({keyword: publication.keywords[i].id});
    }
    return {id: publication.id, title: publication.title,
            numberOfPages: publication.numberOfPages, year: publication.year,
            url: publication.url, authors: auth, disciplines: disc, keywords: key, abstract: publication.abstract};
};

JSONManager.generateProceedingPublication = function(ProcPub){
    var publication = JSONManager.generatePublication(ProcPub);
    publication.conferenceId = ProcPub.conferenceID;
    publication.editors = ProcPub.editor;
    publication.publisher = ProcPub.publisher;
    publication.city = ProcPub.city;
    return publication;
};

JSONManager.generateJournalPublication = function(JourPub){
    var publication = JSONManager.generatePublication(JourPub);
    publication.journalId = JourPub.journalID;
    publication.volume = JourPub.volume;
    publication.number = JourPub.number;
    return publication;
};

module.exports = JSONManager;
