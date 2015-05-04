'use strict';
var Promise = require('bluebird');
var Searchable = require('../database/searchable.js');

/* Rankable : has 'rank' variable that can be calculated
 * (see calculateRank)
 * @superclass Searchable
 * @constructor
 */
var Rankable = function(arg) {
	Searchable.call(this, arg);
};

Rankable.prototype = Object.create(Searchable.prototype);
Rankable.prototype.variables = ['rank'];
Rankable.prototype.variables.push.apply(Rankable.prototype.variables, Searchable.prototype.variables);
/* Calculates the rank of this rankable
 * @return Promise<this> a Promise containing the updated rankable
 * @abstract, @public
 */
Rankable.prototype.calculateRank = function() {
	throw new Error('not implemented');
};
/* all found results will have their rank calculated an be sorted accordingly
 * @see Searchable.fetchAll
 */
Rankable.prototype.fetchAll = function() {
	var rankable = this;
	return Searchable.prototype.fetchAll.call(rankable)
	.then(function(rankables) {
		return Promise.all(rankables.map(function(r) {
			return r.calculateRank();
		}));
	})
	.then(function(rankables) {
		rankables.sort(function(a, b) {
			if(typeof(a.rank) !== 'number' || typeof(b.rank) !== 'number') {
				return 0;
			}
			else {
				return a.rank - b.rank;
			}
		});
		return rankables;
	});
};
Rankable.prototype.constructor = Rankable;

module.exports = Rankable;