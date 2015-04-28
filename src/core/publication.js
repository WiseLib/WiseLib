'use strict';
var Promise = require('bluebird');
var RankAble = require('./rankable.js');
var PublicationRepr = require('../database/linker.js').publicationRepr;
var DBManager = require('../database/dbmanager.js');

var Publication = function(arg) {
	RankAble.call(this, arg);
}
//needed to avoid circular dependency between Person and Publication
module.exports = Publication;
var Person = require('./person.js');

Publication.prototype = Object.create(RankAble.prototype);
Publication.prototype.variables = ['title', 'type', 'numberOfPages', 'year', 'url', 'abstract', 'authors', 'references'];
Publication.prototype.variables.push.apply(Publication.prototype.variables, RankAble.prototype.variables);
Publication.prototype.representation = PublicationRepr;
Publication.prototype.calculateRank = function() {
	var numberOfCitations = 0;
	if(this.references) {
		numberOfCitations = this.references.length;
	}
	var authorRanksPromise = [];
	this.authors.forEach(function(a) {
		authorRanksPromise.push(new Person(a.id).fetch()
			.then(function(pub) {
				return pub.calculateRank();
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
Publication.prototype.fetchAll = function(rankable) {
	return DBManager.get(rankable, Publication.prototype.representation)
	.then(function(res) {
		var rankables = [];
		for(var i in res) {
			rankables.push(new rankable.constructor(res[i]));
		}
		return rankables;
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