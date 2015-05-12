'use strict';
var should = require('should');
var Person = require('../../src/core/person.js');
var Publication = require('../../src/core/publication.js');
var Affiliation = require('../../src/core/affiliation.js');
var _ = require('lodash');
var Promise = require('bluebird');

describe('Person test', function() {

	var fromJSON = new Person({firstName:'Son', lastName:'Goku', affiliation:1, q:'search'});
	var fromID = new Person(9050).fetch();
	var fetched = new Person({lastName: 'Modaal'}).fetchAll();
	var toAdd = new Person({firstName:'Son', lastName:'Goku', publications:[{id:2}]});

	it('should create Person from JSON', function() {
		fromJSON.should.have.property('firstName', 'Son');
		fromJSON.should.have.property('lastName', 'Goku');
		fromJSON.should.have.property('affiliation', 1);
		fromJSON.should.have.property('q', 'search');
	});
	it('should get Person from ID', function(done) {
		fromID.then(function(person) {
			person.should.have.property('id', 9050);
			person.should.not.have.property('firstName',undefined);
			person.should.not.have.property('lastName',undefined);
			person.publications.length.should.be.greaterThan(0);
			done();
		});
	});
	it('should fetch all corresponding Persons', function(done) {
		fetched.then(function(persons) {
			persons.length.should.be.equal(3);
			done();
		});
	});
	it('should calculate rank correctly', function(done) {
		fromJSON.calculateRank()
		.then(function(person) {
			person.should.not.have.property('rank',undefined);
		});
		fromID
		.then(function(person) {
			return person.calculateRank();
		})
		.then(function(person) {
			person.should.not.have.property('rank',undefined);
			done();
		});
	});
	it('should add and delete Person', function(done) {
		toAdd.save().then(function(person) {
			person.should.not.have.property('id',undefined);
			return person.destroy();
		})
		.then(function(person) {
			person.should.have.property('id',undefined);
			done();
		});

	});

	var executeOnTestSet = function(fnToTest) {
		var created = [];
		var toReturn, targetPerson, savedAffiliation, publication;
		var affiliation = new Affiliation({name: 'testAffiliation'});
		return affiliation.save()
		.then(function(savedAffl) {
			created.push(savedAffl);
			savedAffiliation = savedAffl;
			var publication = new Publication({title:'publicationTest',
		                            url:'http://pubtest.com',
		                            numberOfPages:20,
		                            year:2015,
		                            type:'unknown',
		                            q:'search'});
			return publication.save();
		})
		.then(function(savedPublication) {
			created.push(savedPublication);
			publication = savedPublication;
			var person = new Person({firstName: 'targetPerson',
									 lastName: 'test',
									 affiliation: savedAffiliation.id,
									 publications: [{id: publication.id}]});
			return person.save();
		}).then(function(savedPerson) {
			created.push(savedPerson);
			targetPerson = savedPerson;
			var sameAfflPerson = new Person({firstName: 'sameAffil',
											lastName: 'test',
											affiliation: savedAffiliation.id});
			created.push(sameAfflPerson);
			return sameAfflPerson.save();
		}).then(function(savedSameAfflPerson) {
			created.push(savedSameAfflPerson);
			var samePubPerson = new Person({firstName: 'samePub',
											lastName: 'test',
											publications: [{id: publication.id}]});
			created.push(samePubPerson);
			return samePubPerson.save();
		})
		.then(function(SavedSamePubPerson) {
			created.push(SavedSamePubPerson);
			return targetPerson[fnToTest]();
		})
		.then(function(returnValue) {
			toReturn = returnValue;
			created = created.map(function(object) {
				return object.destroy();
			});
			return Promise.all(created);
		})
		.then(function() {
			return toReturn;
		});
	};

	it('should get the contact persons correctly', function(done) {
		executeOnTestSet('getContacts')
		.then(function(contacts) {
			contacts.should.be.instanceof(Array).and.have.lengthOf(2);
			done();
		})
		.catch(function(error) {
			done(error);
		});
	});
	it('should get the contact persons correctly', function(done) {
		executeOnTestSet('getNetwork')
		.then(function(network) {
			network.should.be.instanceof(Array).and.have.lengthOf(9);
			done();
		})
		.catch(function(error) {
			done(error);
		});
	});
});