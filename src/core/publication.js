'use strict';
var Promise = require('bluebird');
var Rankable = require('./rankable.js');
var PublicationRepr = require('../database/linker.js').publicationRepr;
var DBManager = require('../database/dbmanager.js');
var UnknownPublication =  require('./unknownPublication.js')
var errors = require('./errors.js');

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
Publication.prototype.variables = ['title', 'type', 'numberOfPages', 'year', 'url', 'abstract', 'authors','uploader','references', 'unknownReferences', 'UnknownPublicationsToDelete'];
Publication.prototype.variables.push.apply(Publication.prototype.variables, Rankable.prototype.variables);
Publication.prototype.representation = PublicationRepr;

/**
 * Calculates the rank of this publication with the following formula: average author rank * number of references
 * @return {Promise} A promise of a publication object, extended with a rank property.
 * @implements {Rankable}
 */
Publication.prototype.calculateRank = function() {
	var numberOfCitations = 0;
	if (this.references) {
		numberOfCitations = this.references.length;
	}
	var authorRanksPromise = [];
	this.authors.forEach(function(a) {
		authorRanksPromise.push(new Person(a.id)
			.fetch()
			.then(function(pers) {
				return pers.calculateRank();
			})
			.then(function(author) {
				return author.rank;
			}));
	});
	var publication = this;
	return Promise.all(authorRanksPromise)
		.then(function(authorRanks) {
			var averageAuthorRank = 0;
			authorRanks.forEach(function(authorRank) {
				averageAuthorRank += authorRank;
			});
			averageAuthorRank = averageAuthorRank / authorRanks.length;
			publication.rank = numberOfCitations * averageAuthorRank; //no citations : very bad --> rank = 0
			return publication;
		});
};
/**
 * [fetch description]
 * @return {[type]} [description]
 */
Publication.prototype.fetch = function() {
	var writeable = this;
	if(!writeable.id) {
		return Promise.reject(new Error('Object to fetch has no id'));
	}
	return DBManager.get(this, Publication.prototype.representation)
	.then(function(res) {
		if(res.length > 0) {
			writeable.assignVariables(res[0]);
			return writeable;
		}
		else {
			throw new errors.NotFoundError('Publication');
		}
	});
};

/**
 * [fetchAll description]
 * @return {[type]} [description]
 */
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

/**
 * Extended save method of a publication. In case the publication describes (an) unknown publicatio(s) in the database, thi(e)s(e) unknown publication(s) should be deleted
 * and the publications referencing thi(e)s(e) publication(s) should be updated to reference this new publication instead
 * @return {Promis} a promise of the newly added publication object
 * @extends {Writeable.save}
 */
Publication.prototype.save = function() {

	var UnknownPublications = this.UnknownPublicationsToDelete;
	delete this.UnknownPublicationsToDelete;//Just a precaution so save doesn't complain about unknown field

	return this.saveWithRepresentation(Publication.prototype.representation)
	.then(function(publication) {

			if (UnknownPublications !== undefined) {
				//Add an entry in publication_references_publication for every element in UnknownPublications.
				//entry should be referenced_by_id + id of new publication.
				//row in unknown_publication should be deleted. 
				
				var newId = publication.id;

				for (var i = 0; i < UnknownPublications.length; i++) {
					var referencingId = UnknownPublications[i].reference;

					new Publication(referencingId).fetch()
					.then(function(instance) {
							instance.references.push({id:newId});
							instance.save();
					});

					new UnknownPublication(UnknownPublications[i].id).destroy();

				};
			}
		})
};
Publication.prototype.destroy = function() {
	return this.destroyWithRepresentation(Publication.prototype.representation);
};
Publication.prototype.constructor = Publication;

module.exports = Publication;