'use strict';
var AffiliationRepr = require('../database/linker.js').affiliationRepr;
var Tree = require('./tree.js');
/* Affiliation : a person's affiliation (university, faculty...)
 * @superclass Tree
 * @constructor
 */
var Affiliation = function(arg) {
	Tree.call(this, arg);
};

Affiliation.prototype = Object.create(Tree.prototype);
Affiliation.prototype.representation = AffiliationRepr;
Affiliation.prototype.constructor = Affiliation;

module.exports = Affiliation;