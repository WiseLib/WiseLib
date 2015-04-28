'use strict';
var Publication = require('./publication.js');
var ProceedingPublicationRepr = require('../database/linker.js').proceedingPublicationRepr;

var ProceedingPublication = function(arg) {
	Publication.call(this, arg);
}

ProceedingPublication.prototype = Object.create(Publication.prototype);
ProceedingPublication.prototype.variables = ['proceeding', 'editors', 'publisher', 'city'];
ProceedingPublication.prototype.variables.push.apply(ProceedingPublication.prototype.variables, Publication.prototype.variables);
ProceedingPublication.prototype.representation = ProceedingPublication;
ProceedingPublication.prototype.calculateRank = function() {
	throw new Error('not implemented');
};
ProceedingPublication.prototype.constructor = ProceedingPublication;

module.exports = ProceedingPublication;