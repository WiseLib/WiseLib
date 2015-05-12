'use strict';
var should = require('should');
var JournalPublication = require('../../src/core/journalPublication.js');
var _ = require('lodash');

describe('JournalPublication test', function() {

	var fromJSON = new JournalPublication({title:'A test publication',
		                            url:'www.atest.com',
		                            numberOfPages:20,
		                            year:2015,
		                            type:'Journal',
		                            authors: [{id:9022}, {id:9050}],
		                            journal:7,
		                            volume:1,
		                            number:1,
		                            q:'search'});
	var fromID = new JournalPublication(9).fetch();
	var fetched = new JournalPublication({title: 'My publication'}).fetchAll();
	var toAdd = fromJSON;

	it('should create JournalPublication from JSON', function() {
		fromJSON.should.have.property('title', 'A test publication');
		fromJSON.should.have.property('url', 'www.atest.com');
		fromJSON.should.have.property('numberOfPages', 20);
		fromJSON.should.have.property('year', 2015);
		fromJSON.should.have.property('type', 'Journal');
		fromJSON.authors.length.should.be.equal(2);
		fromJSON.should.have.property('journal', 7);
		fromJSON.should.have.property('volume', 1);
		fromJSON.should.have.property('number', 1);
		fromJSON.should.have.property('q', 'search');
	});
	it('should get JournalPublication from ID', function(done) {
		fromID.then(function(publication) {
			publication.should.have.property('id', 9);
			publication.should.not.have.property('title',undefined);
			publication.should.have.property('type', 'Journal');
			publication.should.have.property('year', 2015);
			publication.should.have.property('numberOfPages', 25);
			publication.authors.length.should.be.equal(3);
			publication.should.have.property('journal', 7);
			publication.should.have.property('volume', 25);
			publication.should.have.property('number',1);
			done();
		}).catch(function(error) {
			done(error);
		});
	});
	it('should calculate rank correctly', function(done) {
		fromJSON.calculateRank()
		.then(function(publication) {
			publication.should.not.have.property('rank',undefined);
		});
		fromID
		.then(function(publication) {
			return publication.calculateRank();
		})
		.then(function(publication) {
			publication.should.not.have.property('rank',undefined);
			done();
		});
	});
	it('should fetch all corresponding JournalPublications', function(done) {
		fetched.then(function(publications) {
			publications.length.should.be.equal(1);
			done();
		});

	});
	it('should add and delete JournalPublication', function(done) {
		toAdd.save().then(function(publication) {
			publication.should.not.have.property('id',undefined);
			return publication.destroy();
		})
		.then(function(publication) {
			publication.should.have.property('id',undefined);
			done();
		});

	});
});