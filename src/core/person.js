'use strict';
var Promise = require('bluebird');
var RankAble = require('./rankable.js');
var PersonRepr = require('../database/linker.js').personRepr;

var Person = function(arg) {
	RankAble.call(this, arg);
}
//needed to avoid circular dependency between Person and Publication
module.exports = Person;
var Publication = require('./publication.js');

Person.prototype = Object.create(RankAble.prototype);
Person.prototype.variables = ['firstName', 'lastName', 'affiliation', 'publications'];
Person.prototype.variables.push.apply(Person.prototype.variables, RankAble.prototype.variables);
Person.prototype.representation = PersonRepr;
//gemiddelde aantal publicaties (per jaar) * (1 + publicaties dit jaar)
Person.prototype.calculateRank = function() {
	var person = this;
	if(!this.publications) {
		this.rank = 0;
	}
	else if(this.publications.length === 0) {
		this.rank = 0;
	}
	else {
		var yearsPromise = [];
		this.publications.forEach(function(p) {
			yearsPromise.push(new Publication(p.id).fetch()
				.then(function(publication) {
					return publication.year;
				}));
		});
		return Promise.all(yearsPromise).then(function(years) {
			years.sort();

			var yearsOfWriting = years[years.length - 1] - years[0];
			var date = new Date();
			var thisYearIndex = years.indexOf(date.getFullYear());
			var publicationsThisYear = years.length - thisYearIndex;
			person.rank = (person.publications.length / (yearsOfWriting + 1)) * (1 + publicationsThisYear); // years + 1 because of terrible test data --> /0 errors
			return person;
		});
	}
	return new Promise(function(resolve, reject) {
		resolve(person);
	})
};
Person.prototype.constructor = Person;