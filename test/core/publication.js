'use strict';
var should = require('should');
var Publication = require('../../src/core/publication.js');
var _ = require('lodash');

describe('Publication test', function() {

	var fromJSON = new Publication({title:'A test publication',
		                            url:'www.atest.com',
		                            numberOfPages:20,
		                            year:2015,
		                            type:'unknown',
		                            authors: [{id:9022}, {id:9050}],
		                            q:'search'});
	var fromID = new Publication(9).fetch();
	var fetched = new Publication({title: 'test'}).fetchAll();
	var toAdd = fromJSON;

	it('should create Publication from JSON', function() {
		fromJSON.should.have.property('title', 'A test publication');
		fromJSON.should.have.property('url', 'www.atest.com');
		fromJSON.should.have.property('numberOfPages', 20);
		fromJSON.should.have.property('year', 2015);
		fromJSON.should.have.property('type', 'unknown');
		fromJSON.authors.length.should.be.equal(2);
		fromJSON.should.have.property('q', 'search');
	});
	it('should get Publication from ID', function(done) {
		fromID.then(function(publication) {
			publication.should.have.property('id', 9);
			publication.should.not.have.property('title',undefined);
			publication.should.have.property('type', 'Journal');
			publication.should.have.property('year', 2015);
			publication.should.have.property('numberOfPages', 25);
			publication.authors.length.should.be.equal(2);
			done();
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
	it('should fetch all corresponding Publications', function(done) {
		fetched.then(function(publications) {
			publications.length.should.be.equal(2);
			done();
		});

	});
	it('should add and delete Publication', function(done) {
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