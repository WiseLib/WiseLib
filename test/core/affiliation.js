'use strict';
var should = require('should');
var Affiliation = require('../../src/core/affiliation.js');
var _ = require('lodash');

describe('Affiliation test', function() {
	
	var fromJSON = new Affiliation({name:'affiliation', q:'search'});
	var fromID = new Affiliation(2).fetch();
	var fetched = Affiliation.prototype.fetchAll(new Affiliation({name: 'Vrije Universiteit Brussel'}));
	var toAdd = new Affiliation({name: 'testAffiliation'});

	it('should create Affiliation from JSON', function() {
		_.isEqual(fromJSON.name, 'affiliation').should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
	});
	it('should get Affiliation from ID', function(done) {
		fromID.then(function(affiliation) {
			_.isEqual(affiliation.id, 2).should.be.true;
			_.isEqual(affiliation.name, 'Wetenschappen en Bio-ingenieurswetenschappen').should.be.true;
			_.isEqual(affiliation.parent, 1).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding Affiliations', function(done) {
		fetched.then(function(affiliations) {
			_.isEqual(affiliations.length, 1).should.be.true;
			done();
		});
		
	});
	it('should add and delete Affiliation', function(done) {
		toAdd.save().then(function(affiliation) {
			_.isEqual(affiliation.id === undefined, false).should.be.true;
			return affiliation.destroy();
		})
		.then(function(affiliation) {
			_.isEqual(affiliation.id === undefined, true).should.be.true;
			done();
		});
		
	});
});