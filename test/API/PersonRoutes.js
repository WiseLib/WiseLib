'use strict';
var should = require('should');
var Person = require('./person_test.js');
var Publication = require('./publication_test.js');
var server = require('../../src/communication/routesFunctions.js');


/**
 * This test checks the getPerson(s) method, a function that searches a person given a first and last name.
 *  The test works by calling the function with one or multiple known persons in the database.
 *  If the function succeeds the result gets compared to the known details about the person entry. If the response matches up the test succeeds,
 *  if not an assertion error gets thrown.
 *
 *  @test
 *
 */
describe('Search person in database test', function() {
	var result = new Person.fakeresponse();
	var request = new Person.fakerequest('John', 'Smith');
	describe('Execute function', function() {
		it('should not error', function(done) {
			result.done = done;
			try {
				server.getPersons(request, result);
			} catch (x) {
				done(x);
			}
		});
	});
	describe('Analyse response', function() {
		it('should hold the correct persons', function() {
			result.getresponse().should.not.be.empty;
			result.getresponse().map(function(x) {
					x.should.have.property('firstName', request.firstName);
				});
			result.getresponse().map(function(x) {
					x.should.have.property('lastName', request.lastName);
				});
		});
	});
});

describe('Search person by id', function() {
	var result = new Person.fakeresponse();
	var person = {
		params: {
			id: 10
		}
	}
	describe('Execute function', function() {
		it('should not error', function(done) {
			result.done = done;
			try {
				server.getPerson(person, result);
			} catch (x) {
				done(x);
			}
		});
	});
	describe('Analyse response', function() {
		it('should hold the correct person', function() {
			result = result.getresponse();
			result.should.be.an.object;
			result.should.have.property('id', 10);
			result.should.have.property('firstName', 'Maria')
		});
	});

	describe('getPublications from person', function() {
		var result = new Publication.fakeresponse();
		var request = new Publication.fakerequest({id:1})
		describe('Execute function', function() {
			it('should not error', function(done) {
				result.done = done;
				try {
					server.getPersonPublications(request, result);
				} catch (x) {
					done(x);
				}
			});
		});
		describe('Analyse response', function() {
			it('should hold the correct persons', function() {
				result = result.getresponse()[0];
				result.should.be.an.object;
				result.should.have.property('id', 10);
				result.should.have.property('title', 'The Impact of If-Conversion and Branch Prediction on Program Exe')
			});
		});
	});
});