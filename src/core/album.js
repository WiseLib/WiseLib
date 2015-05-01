'use strict';
var RankAble = require('./rankable.js');

/* Album : a collection of publications, specialized in specific disciplines
 * @superclass RankAble
 * @constructor
 */
var Album = function(arg) {
	RankAble.call(this, arg);
};

Album.prototype = Object.create(RankAble.prototype);
Album.prototype.variables = ['name', 'disciplines'];
Album.prototype.variables.push.apply(Album.prototype.variables, RankAble.prototype.variables);
Album.prototype.calculateRank = function() {
	return this;
};
Album.prototype.constructor = Album;

module.exports = Album;