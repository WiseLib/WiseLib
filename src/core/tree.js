'use strict';
var SearchAble = require('../database/searchable.js');

var Tree = function(arg) {
	SearchAble.call(this, arg);
};

Tree.prototype = Object.create(SearchAble.prototype);
Tree.prototype.variables = ['name', 'parent'];
Tree.prototype.variables.push.apply(Tree.prototype.variables, SearchAble.prototype.variables);
Tree.prototype.constructor = Tree;

module.exports = Tree;