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
		fromJSON.should.have.property('name', 'discipline');
		fromJSON.should.have.property('q', 'search');
	});
	it('should get Discipline from ID', function(done) {
		fromID.then(function(discipline) {
			discipline.should.have.property('id', 2);
			discipline.should.have.property('name', 'Operating systems');
			discipline.should.have.property('parent', 1);
			done();
		});
	});
	it('should fetch all corresponding Disciplines', function(done) {
		fetched.then(function(disciplines) {
			disciplines.length.should.be.equal(1);
			done();
		});
		
	});
	it('should add and delete Discipline', function(done) {
		toAdd.save().then(function(discipline) {
			discipline.should.not.have.property('id',undefined);
			return discipline.destroy();
		})
		.then(function(discipline) {
			discipline.should.have.property('id',undefined);
			done();
		});
		
	});
});