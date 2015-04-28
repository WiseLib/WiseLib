'use strict';
var Promise = require('bluebird');
var DBManager = require('../database/dbmanager.js');
var SearchAble = require('../database/searchable.js');

/* Rankable : has 'rank' variable that can be calculated
 * (see calculateRank)
 * @superclass SearchAble
 * @constructor
 */
var RankAble = function(arg) {
	SearchAble.call(this, arg);
};

RankAble.prototype = Object.create(SearchAble.prototype);
RankAble.prototype.variables = ['rank'];
RankAble.prototype.variables.push.apply(RankAble.prototype.variables, SearchAble.prototype.variables);
/* Calculates the rank of this rankable
 * @return Promise<this> a Promise containing the updated rankable
 * @abstract, @public
 */
RankAble.prototype.calculateRank = function() {
	throw new Error('not implemented');
};
/* all found results will have their rank calculated an be sorted accordingly
 * @see SearchAble.fetchAll
 */
RankAble.prototype.fetchAll = function() {
	var rankable = this;
	return SearchAble.prototype.fetchAll.call(rankable)
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
RankAble.prototype.constructor = RankAble;

module.exports = RankAble;