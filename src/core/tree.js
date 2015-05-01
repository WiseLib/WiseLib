'use strict';
var Searchable = require('../database/searchable.js');

/* Tree : tree-like structure refering to a parent (using variable 'parent')
 * @superclass Searchable
 * @constructor
 */
var Tree = function(arg) {
	Searchable.call(this, arg);
};

Tree.prototype = Object.create(Searchable.prototype);
Tree.prototype.variables = ['name', 'parent'];
Tree.prototype.variables.push.apply(Tree.prototype.variables, Searchable.prototype.variables);
Tree.prototype.constructor = Tree;

module.exports = Tree;