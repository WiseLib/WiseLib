'use strict';
var _ = require('lodash');
var Promise = require('bluebird');
var Rankable = require('./rankable.js');
var PersonRepr = require('../database/linker.js').personRepr;

/* A person linked to an affiliation, and writing publications
 * @superclass Rankable
 * @constructor
 */
var Person = function(arg) {
	Rankable.call(this, arg);
};
//needed to avoid circular dependency between Person and Publication
module.exports = Person;
var Publication = require('./publication.js');

Person.prototype = Object.create(Rankable.prototype);
Person.prototype.variables = ['firstName', 'lastName', 'affiliation', 'publications', 'picture', 'disciplines'];
Person.prototype.variables.push.apply(Person.prototype.variables, Rankable.prototype.variables);
Person.prototype.representation = PersonRepr;

/**
 * Calculates the rank of this person with the following formula: average amount of publications (per year) * (1 + publications this year)
 * @return {Promise} A promise of a person object, extended with a rank property.
 * @implements {Rankable}
 */
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
			var current = new Date().getFullYear();
			var decreaseSpeed = 0.05;
			var minWeight = 0.5;
			var maxWeight = 1.0;
			var rank = 0;
			years.forEach(function(year) {
				var weight = maxWeight - (current - year)*decreaseSpeed;
				if(weight < minWeight) {
					weight = minWeight;
				}
				rank += weight;
			});
			person.rank = rank;
			return person;
		});
	}
	return new Promise(function(resolve) {
		resolve(person);
	});
};

/**
 * Get persons that are connected with the person for which the function is called. Contacts of a person include co-authors and persons who do research in the same discipline
 * @return {Promise<Array>} Thenable which hold the Person's contacts as an Array
 */
Person.prototype.getContacts = function() {
	var person = this;
	var contacts = new Person(person.id).fetch().then(function(p) {
		person = p;
		return new Publication({authors: [{id: person.id}]}).fetchAll();
	})
	.then(function(publications) {
		return Promise.all(publications);
	})
	.then(function(publications) {
		var addedIds = [];
		var authors = [];
		publications.forEach(function(publication) {
			publication.authors.forEach(function(author) {
				if(author.id !== person.id && !_.contains(addedIds, author.id)) { //Only fetch other persons and persons that aren't in the addedIds array yet
					authors.push(new Person(author).fetch());
					addedIds.push(author.id);
				}
			});
		});
		return Promise.all(authors);
	})
	.then(function(coWriters) {
		if(person.affiliation) {
			return new Person({affiliation: person.affiliation}).fetchAll().then(function(persons) {
				return Promise.join(persons, coWriters, function(persons, coWriters){return [persons, coWriters];});
			});
		} else {
			return Promise.all(coWriters);
		}
	})
	.then(function(total) {
		return _.reject(_.uniq(_.flatten(total), function(person) {return person.id;}), {id: person.id}); //Make 1 array of 2, remove duplicates and remove person of which to get the contacts
	});
	return contacts;
};
Person.prototype.constructor = Person;
