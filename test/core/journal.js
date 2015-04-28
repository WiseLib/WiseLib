'use strict';
var should = require('should');
var Journal = require('../../src/core/journal.js');
var _ = require('lodash');

describe('Journal test', function() {
	
	var fromJSON = new Journal({name:'journal', q:'search', rank:12.076});
	var fromID = new Journal(7).fetch();
	var fetched = Journal.prototype.fetchAll(new Journal({name: 'Molecular Systems Biology'}));
	var toAdd = new Journal({name: 'testJournal'});

	it('should create Journal from JSON', function() {
		_.isEqual(fromJSON.name, 'journal').should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
		_.isEqual(fromJSON.rank, 12.076).should.be.true;
	});
	it('should get Journal from ID', function(done) {
		fromID.then(function(journal) {
			_.isEqual(journal.id, 7).should.be.true;
			_.isEqual(journal.rank, 12.076).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding Journals', function(done) {
		fetched.then(function(journals) {
			_.isEqual(journals.length, 1).should.be.true;
			done();
		});
		
	});
	it('should add and delete Journal', function(done) {
		toAdd.save().then(function(journal) {
			_.isEqual(journal.id === undefined, false).should.be.true;
			return journal.destroy();
		})
		.then(function(journal) {
			_.isEqual(journal.id === undefined, true).should.be.true;
			done();
		});
		
	});
});