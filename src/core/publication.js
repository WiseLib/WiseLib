'use strict';
var Promise = require('bluebird');
var Rankable = require('./rankable.js');
var PublicationRepr = require('../database/linker.js').publicationRepr;
var DBManager = require('../database/dbmanager.js');

/* A publication written by a number of persons
 * @superclass Rankable
 * @constructor
 */
var Publication = function(arg) {
	Rankable.call(this, arg);
};
//needed to avoid circular dependency between Person and Publication
module.exports = Publication;
var Person = require('./person.js');

Publication.prototype = Object.create(Rankable.prototype);
Publication.prototype.variables = ['title', 'type', 'numberOfPages', 'year', 'url', 'abstract', 'authors', 'references'];
Publication.prototype.variables.push.apply(Publication.prototype.variables, Rankable.prototype.variables);
Publication.prototype.representation = PublicationRepr;
Publication.prototype.calculateRank = function() {
	var numberOfCitations = 0;
	if(this.references) {
		numberOfCitations = this.references.length;
	}
	var authorRanksPromise = [];
	this.authors.forEach(function(a) {
		authorRanksPromise.push(new Person(a.id).fetch()
			.then(function(pers) {
				return pers.calculateRank();
			})
			.then(function(author) {
				return author.rank;
			}));
	});
	var publication = this;
	return Promise.all(authorRanksPromise).then(function(authorRanks) {
		var averageAuthorRank = 0;
		authorRanks.forEach(function(authorRank) {
			averageAuthorRank += authorRank;
		});
		averageAuthorRank = averageAuthorRank / authorRanks.length;
		publication.rank = numberOfCitations * averageAuthorRank; //no citations : very bad --> rank = 0
		return publication;
	});
};
/* rank is NOT calculated with fetch
 */
Publication.prototype.fetch = function() {
	var writeable = this;
	if(!writeable.id) {
		return Promise.reject(writeable);
	}
	return DBManager.get(this, Publication.prototype.representation)
	.then(function(res) {
		if(res.length > 0) {
			writeable.assignVariables(res[0]);
			return writeable;
		}
		else {
			Promise.reject(writeable.id);
		}
	});
};
Publication.prototype.fetchAll = function() {
	var rankable = this;
	return DBManager.get(rankable, Publication.prototype.representation)
	.then(function(res) {
		return Promise.all(res.map(function(r) {
			return new rankable.constructor(r);
		}));
	})
	.then(function(rankables) {
		return Promise.all(rankables.map(function(r) {
			return Publication.prototype.calculateRank.call(r);
		}));
	})
	.then(function(rankables) {
		rankables.sort(function(a, b) {
			return a.rank - b.rank;
		});
		return rankables;
	});
};
Publication.prototype.save = function() {
	return this.saveWithRepresentation(Publication.prototype.representation);
};
Publication.prototype.destroy = function() {
	return this.destroyWithRepresentation(Publication.prototype.representation);
};
Publication.prototype.constructor = Publication;

module.exports = Publication;