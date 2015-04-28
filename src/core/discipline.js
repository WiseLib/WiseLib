'use strict';
var DisciplineRepr = require('../database/linker.js').disciplineRepr;
var Tree = require('./tree.js');

var Discipline = function(arg) {
	Tree.call(this, arg);
};

Discipline.prototype = Object.create(Tree.prototype);
Discipline.prototype.representation = DisciplineRepr;
Discipline.prototype.constructor = Discipline;

module.exports = Discipline;