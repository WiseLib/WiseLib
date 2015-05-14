'use strict';
var Promise = require('bluebird');
var SpecializedPublication = require('./specializedPublication.js');
var Proceeding = require('./proceeding.js');
var ProceedingPublicationRepr = require('../database/linker.js').proceedingPublicationRepr;

/* A publication that is published in a Proceeding
 * the 'type' is always 'Proceeding'
 * @superclass SpecializedPublication
 * @constructor
 */
var ProceedingPublication = function(arg) {
	this.assignVariables({type: 'Proceeding'});
	SpecializedPublication.call(this, arg);
};

ProceedingPublication.prototype = Object.create(SpecializedPublication.prototype);
ProceedingPublication.prototype.variables = ['publisher', 'editors', 'city', 'proceeding'];
ProceedingPublication.prototype.variables.push.apply(ProceedingPublication.prototype.variables, SpecializedPublication.prototype.variables);
ProceedingPublication.prototype.representation = ProceedingPublicationRepr;
ProceedingPublication.prototype.calculateRank = function() {
	var publication = this;
	var promise = Publication.prototype.calculateRank.call(this)
	.then(function(p) {
		publication.rank = p.rank;
		return new Proceeding(publication.proceeding).fetch();
	})
	.then(function(j) {
		publication.rank = publication.rank*j.rank;
		return publication;
	});
	return promise;
};

ProceedingPublication.prototype.constructor = ProceedingPublication;

module.exports = ProceedingPublication;