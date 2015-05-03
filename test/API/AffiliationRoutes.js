'use strict';
'use strict';
var should = require('should');
var affiliation = require('./affiliation_test.js')
var server = require('../../src/communication/routesFunctions.js');

/**
 * These tests check the affiliation routes, a function which returns a list, in JSON format, of affiliations defined in the database.
 * The first test calls the function, if the function succeeds the answer get compared to the known number of affiliations present in the database.
 * The second tests searches for a affiliation with a given id, the test succeeds if the result holds the correct affiliation.
 * If the returned answer is equal to the known number, the test succeeds, if not, an assertion error is thrown.
 *
 * @test
 */

describe ('Retrieve list of affiliations from server database',function(){
	describe('Retrieve all affiliations',function(){
		var response = new affiliation.fakeresponse();
		describe('Execute query',function(){
			it('should excute without error',function(done){

				response.done = done;
				var request = new affiliation.fakerequest({});
				try{

					server.getAffiliations(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct affiliations',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(8);
			});
		});
	});

	describe('Retrieve affiliation with given id',function(){
		var response = new affiliation.fakeresponse();
		describe('Execute query',function(){
			it('should excute without error',function(done){

				response.done = done;
				var request = new affiliation.fakerequest({id: 1});
				try{

					server.getAffiliation(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct affiliation',function(){
				var result = response.result();
				result.should.be.an.object;
				result.should.have.property('id',1);
				result.should.have.property('name','Vrije Universiteit Brussel');
			});
		});
	});
})