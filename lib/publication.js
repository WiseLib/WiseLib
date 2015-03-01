'use strict';
/**
 * Creates an instance of publication
 *
 * @constructor
 * @this {Publication}
 * @param {object} data This object contains all data necessary for the construction of Publication.
 * @param {string} data.title Contains the title of the publication.
 * @param {number} data.numberOfPages Contains the number of pages the publication has.
 * @param {number} data.year Contains the year when the publication was published.
 * @param {string} data.string Contains the location of the publication.
 * @param {array} data.keywords Contains the keywords linked to the publication.
 * @param {array} data.authors Contains the ID's of all the authors.
 * @param {array} data.disciplines Contains all the disciplines of the publication.
 * @param {number} data.uploaderId Contains the id in the user table of the uploader of the publication
 */

var Publication = function(data){
    if(typeof data !== 'undefined')  {
        this.id = data.id;
        this.title = data.title;
        this.numberOfPages = data.numberOfPages;
        this.year = data.year;
        this.url = data.url;
        this.keywords = data.keywords;
        this.authors = data.authors;
        this.disciplines = data.disciplines;
        this.uploaderId = data.uploaderId;
        this.abstract = data.abstract;
    }
};

/**
 * Creates an instance of ProceedingPublication. This contains all the information
 * of a proceeding and it inherits from the class Publication.
 *
 * @class
 * @augments Publication
 * @this {ProceedingPublication}
 * @param {object} data This object contains all data necessary for the construction of ProceedingPublication.
 * @param {string} data.title Contains the title of the publication. Necessary for construction Publication.
 * @param {number} data.numberOfPages Contains the number of pages the publication has. Necessary for construction Publication.
 * @param {number} data.year Contains the year when the publication was published. Necessary for construction Publication.
 * @param {string} data.string Contains the location of the publication. Necessary for construction Publication.
 * @param {array} data.keywords Contains the keywords linked to the publication. Necessary for construction Publication.
 * @param {array} data.authors Contains the ID's of all the authors. Necessary for construction Publication.
 * @param {array} data.disciplines Contains all the disciplines of the publication. Necessary for construction Publication.
 * @param {string} data.editors Contains the name of the company who edited the proceeding.
 * @param {string} data.publishers Contains the name of the company who published the proceeding.
 * @param {string} data.city Contains the name of the city where the conference was held.
 */
ProceedingPublication.prototype = new Publication();
ProceedingPublication.prototype.constructor = ProceedingPublication;
function ProceedingPublication(data){
    Publication.call(this, data);
    this.type = 'Proceeding';
    this.conferenceID = null;
    this.editor = data.editors;
    this.publisher = data.publisher;
    this.city = data.city;
}

/**
* Creates an instance of JournalPublication. This contains all the information
* of a journal and it inherits from the class Publication.
*
* @class
* @augments Publication
* @this {JournalPublication}
* @param {object} data This object contains all data necessary for the construction of JournalPublication.
* @param {string} data.title Contains the title of the publication. Necessary for construction Publication.
* @param {number} data.numberOfPages Contains the number of pages the publication has. Necessary for construction Publication.
* @param {number} data.year Contains the year when the publication was published. Necessary for construction Publication.
* @param {string} data.string Contains the location of the publication. Necessary for construction Publication.
* @param {array} data.keywords Contains the keywords linked to the publication. Necessary for construction Publication.
* @param {array} data.authors Contains the ID's of all the authors. Necessary for construction Publication.
* @param {array} data.disciplines Contains all the disciplines of the publication. Necessary for construction Publication.
* @param {number} data.volume Contains the number of the volume in which the journal appeared.
* @param {number} data.number Contains the number in which the journal appeared.
*/
JournalPublication.prototype = new Publication();
JournalPublication.prototype.constructor = JournalPublication;
function JournalPublication(data){
    Publication.call(this, data);
    this.type = 'Journal';
    this.journalID = null;
    this.volume = data.volume;
    this.number = data.number;
}

module.exports = Publication;