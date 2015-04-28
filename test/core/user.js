'use strict';
var should = require('should');
var User = require('../../src/core/user.js');
var _ = require('lodash');

describe('User test', function() {
	
	var fromJSON = new User({email:'bruce@wayne.com', password:'ImBatman', person:9116, q:'search'});
	var fromID = new User(262).fetch();
	var fetched = User.prototype.fetchAll(new User({email: 'mreymond@vub.ac.be'}));
	var toAdd = new User({email:'sean.connery@bond.com', password:'theTrueBond', person:9115});

	it('should create User from JSON', function() {
		_.isEqual(fromJSON.email, 'bruce@wayne.com').should.be.true;
		_.isEqual(fromJSON.password, 'ImBatman').should.be.true;
		_.isEqual(fromJSON.person, 9116).should.be.true;
		_.isEqual(fromJSON.q, 'search').should.be.true;
	});
	it('should get User from ID', function(done) {
		fromID.then(function(user) {
			_.isEqual(user.id, 262).should.be.true;
			_.isEqual(user.email === undefined, false).should.be.true;
			_.isEqual(user.password === undefined, false).should.be.true;
			_.isEqual(user.person, 9116).should.be.true;
			_.isEqual(user.library === undefined, false).should.be.true;
			done();
		});
	});
	it('should fetch all corresponding Users', function(done) {
		fetched.then(function(users) {
			_.isEqual(users.length, 1).should.be.true;
			done();
		});
		
	});
	it('should add and delete User', function(done) {
		toAdd.save().then(function(user) {
			_.isEqual(user.id === undefined, false).should.be.true;
			return user.destroy();
		})
		.then(function(user) {
			_.isEqual(user.id === undefined, true).should.be.true;
			done();
		});
		
	});
});