'use strict';
var Promise = require('bluebird');
var DBManager = require('../database/dbmanager.js');
var SearchAble = require('../database/searchable.js');

var RankAble = function(arg) {
	SearchAble.call(this, arg);
};

RankAble.prototype = Object.create(SearchAble.prototype);
RankAble.prototype.variables = ['rank'];
RankAble.prototype.variables.push.apply(RankAble.prototype.variables, SearchAble.prototype.variables);
RankAble.prototype.calculateRank = function() {
	throw new Error('not implemented');
};
RankAble.prototype.fetchAll = function() {
	var rankable = this;
	return SearchAble.prototype.fetchAll.call(rankable)
	.then(function(rankables) {
		rankables.sort(function(a, b) {
			if(!a.rank || !b.rank) return 0;
			return a.rank - b.rank;
		});
		return rankables;
	});
};
RankAble.prototype.constructor = RankAble;

module.exports = RankAble;