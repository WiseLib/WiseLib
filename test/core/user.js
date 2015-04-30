'use strict';
var should = require('should');
var User = require('../../src/core/user.js');
var _ = require('lodash');

describe('User test', function() {
	
	var fromJSON = new User({email:'bruce@wayne.com', password:'ImBatman', person:9116, q:'search'});
	var fromID = new User(262).fetch();
	var fetched = new User({email: 'mreymond@vub.ac.be'}).fetchAll();
	var toAdd = new User({email:'sean.connery@bond.com', password:'theTrueBond', person:9115});

	it('should create User from JSON', function() {
		fromJSON.should.have.property('email', 'bruce@wayne.com');
		fromJSON.should.have.property('password', 'ImBatman');
		fromJSON.should.have.property('person', 9116);
		fromJSON.should.have.property('q', 'search');
	});
	it('should get User from ID', function(done) {
		fromID.then(function(user) {
			user.should.have.property('id', 262);
			user.should.not.have.property('email',undefined);
			user.should.not.have.property('password',undefined);
			user.should.have.property('person', 9116);
			user.should.not.have.property('library',undefined);
			done();
		});
	});
	it('should fetch all corresponding Users', function(done) {
		fetched.then(function(users) {
			users.length.should.be.equal(1);
			done();
		});
		
	});
	it('should add and delete User', function(done) {
		toAdd.save().then(function(user) {
			user.should.not.have.property('id',undefined);
			return user.destroy();
		})
		.then(function(user) {
			user.should.have.property('id',undefined);
			done();
		});
		
	});
});