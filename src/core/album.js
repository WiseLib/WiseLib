'use strict';
var RankAble = require('./rankable.js');

var Album = function(arg) {
	RankAble.call(this, arg);
}

Album.prototype = Object.create(RankAble.prototype);
Album.prototype.variables = ['name', 'disciplines'];
Album.prototype.variables.push.apply(Album.prototype.variables, RankAble.prototype.variables);
Album.prototype.calculateRank = function() {
	return this.rank;
};
Album.prototype.constructor = Album;

module.exports = Album;