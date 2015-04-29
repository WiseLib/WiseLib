'use strict';
var should = require('should');
var Journal = require('../../src/core/journal.js');
var _ = require('lodash');

describe('Journal test', function() {
	
	var fromJSON = new Journal({name:'journal', q:'search', rank:12.076});
	var fromID = new Journal(7).fetch();
	var fetched = new Journal({name: 'Molecular Systems Biology'}).fetchAll();
	var toAdd = new Journal({name: 'testJournal'});

	it('should create Journal from JSON', function() {
		fromJSON.should.have.property('name', 'journal');
		fromJSON.should.have.property('q', 'search');
		fromJSON.should.have.property('rank', 12.076);
	});
	it('should get Journal from ID', function(done) {
		fromID.then(function(journal) {
			journal.should.have.property('id', 7);
			journal.should.have.property('rank', 12.076);
			done();
		});
	});
	it('should fetch all corresponding Journals', function(done) {
		fetched.then(function(journals) {
			journals.length.should.be.equal(1);
			done();
		});
		
	});
	it('should add and delete Journal', function(done) {
		toAdd.save().then(function(journal) {
			journal.should.not.have.property('id',undefined);
			return journal.destroy();
		})
		.then(function(journal) {
			journal.should.have.property('id',undefined);
			done();
		});
		
	});
});