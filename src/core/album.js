'use strict';
var Rankable = require('./rankable.js');

/* Album : a collection of publications, specialized in specific disciplines
 * @superclass Rankable
 * @constructor
 */
var Album = function(arg) {
	Rankable.call(this, arg);
};

Album.prototype = Object.create(Rankable.prototype);
Album.prototype.variables = ['name', 'disciplines'];
Album.prototype.variables.push.apply(Album.prototype.variables, Rankable.prototype.variables);
Album.prototype.calculateRank = function() {
	return this;
};
Album.prototype.constructor = Album;

module.exports = Album;