'use strict';
var should = require('should');
var User = require('./user_test.js');
var server = require('../../src/routesFunctions.js');

/**
 * This test checks the getUser(s) method, a function that searches a user given a first and last name.
 *  The test works by calling the function with one or multiple known users in the database.
 *  If the function succeeds the result gets compared to the known details about the user entry. If the response matches up the test succeeds,
 *  if not an assertion error gets thrown.
 *
 *  @test
 *
 */
describe('Search user in database test', function() {
	describe('Search user by id', function() {
		var result = new User.fakeresponse();
		var user = {params: {id: 1}};

		describe('Execute function', function() {
			it('should not error', function(done) {
				result.done = done;
				try {
					server.getUser(user, result);
				} catch (x) {
					done(x);
				}
			});
		});
		describe('Analyse response', function() {
			it('should hold the correct user', function() {
				result = result.result;
				result.should.be.an.object;
				result.should.have.property('email','person1@mail.com');
				result.should.have.property('id', 1);
			});
		});
	});
});