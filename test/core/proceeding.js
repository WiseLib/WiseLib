'use strict';
var should = require('should');
var Proceeding = require('../../src/core/proceeding.js');
var _ = require('lodash');

describe('Proceeding test', function() {
	
	var fromJSON = new Proceeding({name:'proceeding', q:'search', rank:12.076});
	var fromID = new Proceeding(1).fetch();
	var fetched = new Proceeding({
		name: 'Proceedings of the IEEE Computer Society Conference on Computer Vision and Pattern Recognition'
	}).fetchAll();
	var toAdd = new Proceeding({name: 'testProceeding'});

	it('should create Proceeding from JSON', function() {
		_.isEqual(fromJSON.name, 'proceeding').should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
		_.isEqual(fromJSON.rank, 12.076).should.be.true;
	});
	it('should get Proceeding from ID', function(done) {
		fromID.then(function(proceeding) {
			_.isEqual(proceeding.id, 1).should.be.true;
			_.isEqual(proceeding.rank, 2.954).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding Proceedings', function(done) {
		fetched.then(function(proceedings) {
			_.isEqual(proceedings.length, 2).should.be.true;
			done();
		});
		
	});
	it('should add and delete Proceeding', function(done) {
		toAdd.save().then(function(proceeding) {
			_.isEqual(proceeding.id === undefined, false).should.be.true;
			return proceeding.destroy();
		})
		.then(function(proceeding) {
			_.isEqual(proceeding.id === undefined, true).should.be.true;
			done();
		});
		
	});
});