'use strict';
var should = require('should');
var Person = require('../../src/core/person.js');
var _ = require('lodash');

describe('Person test', function() {
	
	var fromJSON = new Person({firstName:'Son', lastName:'Goku', affiliation:1, q:'search'});
	var fromID = new Person(9050).fetch();
	var fetched = Person.prototype.fetchAll(new Person({lastName: 'Modaal'}));
	var toAdd = new Person({firstName:'Son', lastName:'Goku', publications:[{id:2}]});

	it('should create Person from JSON', function() {
		_.isEqual(fromJSON.firstName, 'Son').should.be.true;
		_.isEqual(fromJSON.lastName, 'Goku').should.be.true;
		_.isEqual(fromJSON.affiliation, 1).should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
	});
	it('should get Person from ID', function(done) {
		fromID.then(function(person) {
			_.isEqual(person.id, 9050).should.be.true;
			_.isEqual(person.firstName === undefined, false).should.be.true;
			_.isEqual(person.lastName === undefined, false).should.be.true;
			_.isEqual(person.publications.length > 0, true).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding Persons', function(done) {
		fetched.then(function(persons) {
			_.isEqual(persons.length, 3).should.be.true;
			done();
		});
	});
	it('should calculate rank correctly', function(done) {
		fromJSON.calculateRank()
		.then(function(person) {
			_.isEqual(person.rank === undefined, false).should.be.true;
		});
		fromID
		.then(function(person) {
			return person.calculateRank();
		})
		.then(function(person) {
			_.isEqual(person.rank === undefined, false).should.be.true;
			done();
		});
	});
	it('should add and delete Person', function(done) {
		toAdd.save().then(function(person) {
			_.isEqual(person.id === undefined, false).should.be.true;
			return person.destroy();
		})
		.then(function(person) {
			_.isEqual(person.id === undefined, true).should.be.true;
			done();
		});
		
	});
});