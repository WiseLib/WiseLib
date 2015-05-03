'use strict';
var should = require('should');
var Affiliation = require('../../src/core/affiliation.js');
var _ = require('lodash');

describe('Affiliation test', function() {
	
	var fromJSON = new Affiliation({name:'affiliation', q:'search'});
	var fromID = new Affiliation(2).fetch();
	var fetched = new Affiliation({name: 'Vrije Universiteit Brussel'}).fetchAll();
	var toAdd = new Affiliation({name: 'testAffiliation'});

	it('should create Affiliation from JSON', function() {
		fromJSON.should.have.property('name','affiliation');
		fromJSON.should.have.property('q','search');
	});
	it('should get Affiliation from ID', function(done) {
		fromID.then(function(affiliation) {
			affiliation.should.have.property('id', 2);
			affiliation.should.have.property('name', 'Wetenschappen en Bio-ingenieurswetenschappen');
			affiliation.should.have.property('parent', 1);
			done();
		});
	});
	it('should fetch all corresponding Affiliations', function(done) {
		fetched.then(function(affiliations) {
			affiliations.length.should.be.equal(1);
			done();
		});
		
	});
	it('should add and delete Affiliation', function(done) {
		toAdd.save().then(function(affiliation) {
			affiliation.should.not.have.property('id',undefined);
			return affiliation.destroy();
		})
		.then(function(affiliation) {
			affiliation.should.have.property('id',undefined);
			done();
		});
		
	});
});