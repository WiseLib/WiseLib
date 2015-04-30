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
		fromJSON.should.have.property('name', 'proceeding');
		fromJSON.should.have.property('q', 'search');
		fromJSON.should.have.property('rank', 12.076);
	});
	it('should get Proceeding from ID', function(done) {
		fromID.then(function(proceeding) {
			proceeding.should.have.property('id', 1);
			proceeding.should.have.property('rank', 2.954);
			done();
		});
	});
	it('should fetch all corresponding Proceedings', function(done) {
		fetched.then(function(proceedings) {
			proceedings.length.should.be.equal(2);
			done();
		});
		
	});
	it('should add and delete Proceeding', function(done) {
		toAdd.save().then(function(proceeding) {
			proceeding.should.not.have.property('id',undefined);
			return proceeding.destroy();
		})
		.then(function(proceeding) {
			proceeding.should.have.property('id',undefined);
			done();
		});
		
	});
});