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
	it('Should get the contact persons correctly', function(done) {
		var created = [];
		var affiliation = new Affiliation({name: 'getContactsAffiliation'});
		created.push(affiliation);
		affiliation.save().then(function(savedAffl) {
			var person = new Person({firstName: 'getContacts',
									 lastName: 'test',
									 affiliation: savedAffl.id,
									 publications: []});
			created.push(person);
			var sameAfflPerson = new Person({firstName: 'sameAffl',
											lastName: 'contactsTest',
											affiliation: savedAffl.id,
											publications: []});
			created.push(sameAfflPerson);
			var samePubPerson = new Person({firstName: 'samePub',
											lastName: 'contactsTest',
											publications: []});
			created.push(samePubPerson);
			return Promise.all([person.save(), sameAfflPerson.save(), samePubPerson.save()]);
		})
		.then(function(persons) {
			var publication = new Publication({title:'getContactsTest',
		                            url:'http://getContactsTest.com',
		                            numberOfPages:20,
		                            year:2015,
		                            type:'unknown',
		                            authors: [{id: persons[0].id}, {id: persons[2].id}],
		                            q:'search'});
			created.push(publication);
			persons.push(publication.save());
			return Promise.all(persons);
		})
		.then(function(persons) {
			return persons[0].getContacts();
		})
		.then(function(contacts) {
			contacts.should.be.instanceof(Array).and.have.lengthOf(2);
			created = created.map(function(object) {
				return object.destroy();
			});
			return Promise.all(created);
		})
		.then(function() {
			done();
		})
		.catch(function(error) {
			done(error);
		});
	});
});