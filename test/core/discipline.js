'use strict';
var should = require('should');
var Discipline = require('../../src/core/discipline.js');
var _ = require('lodash');

describe('Discipline test', function() {
	
	var fromJSON = new Discipline({name:'discipline', q:'search'});
	var fromID = new Discipline(2).fetch();
	var fetched = new Discipline({name: 'Computer Science'}).fetchAll();
	var toAdd = new Discipline({name: 'testDiscipline'});

	it('should create Discipline from JSON', function() {
		_.isEqual(fromJSON.name, 'discipline').should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
	});
	it('should get Discipline from ID', function(done) {
		fromID.then(function(discipline) {
			_.isEqual(discipline.id, 2).should.be.true;
			_.isEqual(discipline.name, 'Operating systems').should.be.true;
			_.isEqual(discipline.parent, 1).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding Disciplines', function(done) {
		fetched.then(function(disciplines) {
			_.isEqual(disciplines.length, 1).should.be.true;
			done();
		});
		
	});
	it('should add and delete Discipline', function(done) {
		toAdd.save().then(function(discipline) {
			_.isEqual(discipline.id === undefined, false).should.be.true;
			return discipline.destroy();
		})
		.then(function(discipline) {
			_.isEqual(discipline.id === undefined, true).should.be.true;
			done();
		});
		
	});
});