'use strict';
var should = require('should');
var JournalPublication = require('../../src/core/journalPublication.js');
var _ = require('lodash');

describe('JournalPublication test', function() {
	
	var fromJSON = new JournalPublication({title:'A test publication', 
		                            url:'www.atest.com', 
		                            numberOfPages:20, 
		                            year:2015,
		                            type:'unknown',
		                            authors: [{id:9022}, {id:9050}],
		                            journal:7,
		                            volume:1,
		                            number:1,
		                            q:'search'});
	var fromID = new JournalPublication(9).fetch();
	var fetched = JournalPublication.prototype.fetchAll(new JournalPublication({title: 'My publication'}));
	var toAdd = fromJSON;

	it('should create JournalPublication from JSON', function() {
		_.isEqual(fromJSON.title, 'A test publication').should.be.true;
		_.isEqual(fromJSON.url, 'www.atest.com').should.be.true;
		_.isEqual(fromJSON.numberOfPages, 20).should.be.true;
		_.isEqual(fromJSON.year, 2015).should.be.true;
		_.isEqual(fromJSON.type, 'unknown').should.be.true;
		_.isEqual(fromJSON.authors.length, 2).should.be.true;
		_.isEqual(fromJSON.journal, 7).should.be.true;
		_.isEqual(fromJSON.volume, 1).should.be.true;
		_.isEqual(fromJSON.number, 1).should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
	});
	it('should get JournalPublication from ID', function(done) {
		fromID.then(function(publication) {
			_.isEqual(publication.id, 9).should.be.true;
			_.isEqual(publication.title === undefined, false).should.be.true;
			_.isEqual(publication.type, 'Journal').should.be.true;
			_.isEqual(publication.year, 2015).should.be.true;
			_.isEqual(publication.numberOfPages, 25).should.be.true;
			_.isEqual(publication.authors.length, 2).should.be.true;
			_.isEqual(publication.journal, 7).should.be.true;
			_.isEqual(publication.volume, 25).should.be.true;
			_.isEqual(publication.number, 1).should.be.true;
			done();
		});
	});
	it('should calculate rank correctly', function(done) {
		fromJSON.calculateRank()
		.then(function(publication) {
			_.isEqual(publication.rank === undefined, false).should.be.true;
		});
		fromID
		.then(function(publication) {
			return publication.calculateRank();
		})
		.then(function(publication) {
			_.isEqual(publication.rank === undefined, false).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding JournalPublications', function(done) {
		fetched.then(function(publications) {
			_.isEqual(publications.length, 1).should.be.true;
			done();
		});
		
	});
	it('should add and delete JournalPublication', function(done) {
		toAdd.save().then(function(publication) {
			_.isEqual(publication.id === undefined, false).should.be.true;
			return publication.destroy();
		})
		.then(function(publication) {
			_.isEqual(publication.id === undefined, true).should.be.true;
			done();
		});
		
	});
});