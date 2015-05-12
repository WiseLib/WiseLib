'use strict';
var Promise = require('bluebird');
var SpecializedPublication = require('./specializedPublication.js');
var Publication = require('./publication.js');
var Journal = require('./journal.js');
var JournalPublicationRepr = require('../database/linker.js').journalPublicationRepr;

/* A publication that is pubished in a Journal
 * the 'type' is always 'Journal'
 * @superclass Publication
 * @constructor
 */
var JournalPublication = function(arg) {
	this.assignVariables({type: 'Journal'});
	SpecializedPublication.call(this, arg);
};
JournalPublication.prototype = Object.create(SpecializedPublication.prototype);
JournalPublication.prototype.variables = ['journal', 'volume', 'number'];
JournalPublication.prototype.variables.push.apply(JournalPublication.prototype.variables, SpecializedPublication.prototype.variables);
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

JournalPublication.prototype.constructor = JournalPublication;

module.exports = JournalPublication;
