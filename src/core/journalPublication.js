'use strict';
var Promise = require('bluebird');
var Publication = require('./publication.js');
var Journal = require('./journal.js');
var DBManager = require('../database/dbmanager.js');
var JournalPublicationRepr = require('../database/linker.js')
	.journalPublicationRepr;

/* A publication that is pubished in a Journal
 * the 'type' is always 'Journal'
 * @superclass Publication
 * @constructor
 */
var JournalPublication = function(arg) {
	this.assignVariables({type: 'Journal'});
	Publication.call(this, arg);
};

JournalPublication.prototype = Object.create(Publication.prototype);
JournalPublication.prototype.variables = ['journal', 'volume', 'number'];
JournalPublication.prototype.variables.push.apply(JournalPublication.prototype.variables, Publication.prototype.variables);
JournalPublication.prototype.representation = JournalPublicationRepr;

/**
 * Calculates the rank of this Journalpublication with the following formula: rank of the superclass publication * rank of the journal (fixed)
 * @return {Promise} A promise of a Journalpublication object, extended with a rank property.
 * @implements {Rankable}
 */
JournalPublication.prototype.calculateRank = function() {
	var publication = this;
	var promise = Publication.prototype.calculateRank.call(this)
		.then(function(p) {
			publication.rank = p.rank;
			return new Journal(publication.journal)
				.fetch();
		})
		.then(function(j) {
			publication.rank = publication.rank * j.rank;
			return publication;
		});
	return promise;
};

/**
 * [fetch description]
 * @return {[type]} [description]
 */
JournalPublication.prototype.fetch = function() {
	var journalPublication = this;
	var promise = Publication.prototype.fetch.call(this);
	return promise.then(function(publication) {
			return DBManager.get(publication);
		})
		.then(function(res) {
			journalPublication.assignVariables(res[0]);
			return journalPublication;
		});
};

/**
 * [fetchAll description]
 * @return {[type]} [description]
 */
JournalPublication.prototype.fetchAll = function() {
	var jp = this;
	//db will only search on Representation.relationSearch and Representation[searchKey]
	var publication = new Publication(jp);
	var journalPublication = new jp.constructor(jp);
	var filter = JournalPublication.prototype.representation[jp.searchKey]
	.concat(JournalPublication.prototype.representation.relationSearch);
	//make sure no other tags are specified
	journalPublication.removeInvalidTags(filter);
	var common = publication.hasVariables(['type', publication.searchKey]) ||
	             journalPublication.hasVariables(['type', journalPublication.searchKey]);
	var all = publication.q && journalPublication.q;
	var dbp = DBManager.get(publication);
	var dbjp = DBManager.get(journalPublication);
	return Promise.all([dbp, dbjp])
	.then(function(types) {
		var results = {};
		var publications = [];
		types[0].forEach(function(publication) {
			results[publication.id] = publication;
		});
		types[1].forEach(function(publication) {
			var p = results[publication.id];
			results[publication.id] = undefined;
			//if results were found in both lists, add them to results
			if(p) {
				var pub = new jp.constructor(p);
				pub.assignVariables(publication);
				publications.push(pub);
			}
			//if results were only found in second list, only add them if :
			//* there were no filters in the fetch
			//* both lists had a valid search variable
			else if(!common && all) {
				publications.push(new Publication(publication.id).fetch()
				.then(function(instance) {
					var pub = new jp.constructor(instance);
					pub.assignVariables(publication);
					return pub;
				}));
			}
		});
		//add results found only in first list, if same conditions are true as previous comment
		if(!common && all) {
			Object.keys(results).forEach(function(id) {
				publications.push(new jp.constructor(id).fetch());
			});
		}
		return Promise.all(publications);
	});
};

/**
 * [save description]
 * @return {[type]} [description]
 */
JournalPublication.prototype.save = function() {
	var journalPublication = this;
	var save = journalPublication.id ? DBManager.put : DBManager.post;
	return Publication.prototype.save.call(journalPublication)
		.then(function(publication) {
			return save(journalPublication);
		})
		.then(function() {
			return journalPublication;
		});
};

/**
 * [destroy description]
 * @return {[type]} [description]
 */
JournalPublication.prototype.destroy = function() {
	var journalPublication = this;
	//need to hold on the ID
	var id = journalPublication.id;
	return journalPublication.destroyWithRepresentation(journalPublication.representation)
		.then(function() {
			journalPublication.assignVariables({
				id: id
			});
			return Publication.prototype.destroy.call(journalPublication);
		});
};
JournalPublication.prototype.constructor = JournalPublication;

module.exports = JournalPublication;