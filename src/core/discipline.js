'use strict';
var DisciplineRepr = require('../database/linker.js').disciplineRepr;
var Tree = require('./tree.js');
/* Discipline : an academic discipline, can be the subdiscipline of another discipline
 * @superclass Tree
 * @constructor
 */
var Discipline = function(arg) {
	Tree.call(this, arg);
};

Discipline.prototype = Object.create(Tree.prototype);
Discipline.prototype.representation = DisciplineRepr;
Discipline.prototype.constructor = Discipline;

module.exports = Discipline;