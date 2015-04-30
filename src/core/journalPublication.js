'use strict';
var Promise = require('bluebird');
var Publication = require('./publication.js');
var Journal = require('./journal.js');
var DBManager = require('../database/dbmanager.js');
var JournalPublicationRepr = require('../database/linker.js').journalPublicationRepr;

/* A publication that is pubished in a Journal
 * the 'type' is always 'Journal' 
 * @superclass Publication
 * @constructor
 */
var JournalPublication = function(arg) {
	Publication.call(this, arg);
	this.assignVariables({type: 'Journal'});
}

JournalPublication.prototype = Object.create(Publication.prototype);
JournalPublication.prototype.variables = ['journal', 'volume', 'number'];
JournalPublication.prototype.variables.push.apply(JournalPublication.prototype.variables, Publication.prototype.variables);
JournalPublication.prototype.representation = JournalPublicationRepr;
JournalPublication.prototype.calculateRank = function() {
	var publication = this;
	var promise = Publication.prototype.calculateRank.call(this)
	.then(function(p) {
		publication.rank = p.rank;
		return new Journal(publication.journal).fetch();
	})
	.then(function(j) {
		publication.rank = publication.rank*j.rank;
		return publication;
	});
	return promise;
};
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
JournalPublication.prototype.fetchAll = function() {
	var journalPublication = this;
	console.log('jp fetchAll');
	console.log(journalPublication);
	var promise = Publication.prototype.fetchAll.call(journalPublication)
	.then(function(publications) {
		console.log(publications);
		var results = [];
		publications.forEach(function(publication) {
			results.push(DBManager.get(publication)
				.then(function(res) {
					return res[0];
				})
				.then(function(jpJson) {
					var jp = new journalPublication.constructor(jpJson);
					jp.assignVariables(publication);
					return jp.calculateRank();
				}));
		});
		return results;
	})
	.all();
	return promise;
};
JournalPublication.prototype.save = function() {
	var journalPublication = this;
	var save = journalPublication.id ? DBManager.put : DBManager.post;
	return Publication.prototype.save.call(journalPublication)
	.then(function(publication) {
		return save(journalPublication);
	})
	.then(function(id) {
		return journalPublication;
	});
};
JournalPublication.prototype.destroy = function() {
	var journalPublication = this;
	//need to hold on the ID
	var id = journalPublication.id;
	return journalPublication.destroyWithRepresentation(journalPublication.representation)
	.then(function() {
		journalPublication.assignVariables({id:id});
		return Publication.prototype.destroy.call(journalPublication);
	});
};
JournalPublication.prototype.constructor = JournalPublication;

module.exports = JournalPublication;