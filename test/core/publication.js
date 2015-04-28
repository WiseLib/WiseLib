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
	var fetched = Publication.prototype.fetchAll(new Publication({title: 'test'}));
	var toAdd = fromJSON;

	it('should create Publication from JSON', function() {
		_.isEqual(fromJSON.title, 'A test publication').should.be.true;
		_.isEqual(fromJSON.url, 'www.atest.com').should.be.true;
		_.isEqual(fromJSON.numberOfPages, 20).should.be.true;
		_.isEqual(fromJSON.year, 2015).should.be.true;
		_.isEqual(fromJSON.type, 'unknown').should.be.true;
		_.isEqual(fromJSON.authors.length, 2).should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
	});
	it('should get Publication from ID', function(done) {
		fromID.then(function(publication) {
			_.isEqual(publication.id, 9).should.be.true;
			_.isEqual(publication.title === undefined, false).should.be.true;
			_.isEqual(publication.type, 'Journal').should.be.true;
			_.isEqual(publication.year, 2015).should.be.true;
			_.isEqual(publication.numberOfPages, 25).should.be.true;
			_.isEqual(publication.authors.length, 2).should.be.true;
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
	it('should fetch all corresponding Publications', function(done) {
		fetched.then(function(publications) {
			_.isEqual(publications.length, 2).should.be.true;
			done();
		});
		
	});
	it('should add and delete Publication', function(done) {
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