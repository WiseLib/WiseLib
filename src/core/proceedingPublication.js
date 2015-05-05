'use strict';
var Publication = require('./publication.js');
var ProceedingPublicationRepr = require('../database/linker.js').proceedingPublicationRepr;
var errors = require('./errors');

/* A publication used in a conference
 * @superclass Publication
 * @constructor
 */
var ProceedingPublication = function(arg) {
	Publication.call(this, arg);
};

ProceedingPublication.prototype = Object.create(Publication.prototype);
ProceedingPublication.prototype.variables = ['proceeding', 'editors', 'publisher', 'city'];
ProceedingPublication.prototype.variables.push.apply(ProceedingPublication.prototype.variables, Publication.prototype.variables);
ProceedingPublication.prototype.representation = ProceedingPublicationRepr;
ProceedingPublication.prototype.calculateRank = function() {
	throw new errors.NotImplementedError();
};
ProceedingPublication.prototype.constructor = ProceedingPublication;

module.exports = ProceedingPublication;