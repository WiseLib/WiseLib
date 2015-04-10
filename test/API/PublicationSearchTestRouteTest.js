'use strict';
var should = require('should');
var person = require('./person_test.js')
var publication = require('./publication_test.js');
var server = require('../../src/routesFunctions.js');

/**
 * This test checks the getPublications method, a function that return a list, in JSON format, of all publications present in the database.
 * The the test calls the function, if the function succeeds the answer get compared to the known number of publications present in the database.
 * If the returned answer is equal to the known number the test succeeds, if not, an assertion error is thrown.
 *
 * @test
 */
describe ('Retrieve list of publications from server database',function(){
	describe('Retrieve all publications',function(){
		var response = new publication.fakeresponse();
		describe('Execute function',function(){
			it('should excute without error',function(done){

				response.done=done;
				var request = new publication.fakerequest({});
				try{
					server.getPublications(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct publications',function(){
				var result = response.getresponse();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(13);
			});
		});
	});
	describe('Retrieve publication with given id',function(){
		var response = new publication.fakeresponse();
		describe('Execute function',function(){
			it('should excute without error',function(done){

				response.done=done;
				var request = new publication.fakerequest({id: 9});
				try{
					server.getPublication(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct publication',function(){
				var result = response.getresponse();
				result.should.be.an.object;
				result.should.have.property('id',9);
				result.should.have.property('title','My publication');
			});
		});
	});
	describe('Retrieve disciplines of a given publication',function(){
		var response = new person.fakeresponse();
		describe('Execute function',function(){
			it('should execute withour error',function(done){
				response.done=done;
				var request = new publication.fakerequest({id: 9});
				try{
					request.query={};//we only want params to have the id
					server.getPublicationAuthors(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct publications',function(){
				var result = response.getresponse();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(2)
				result[0].should.have.property('id',2);
				result[1].should.have.property('id',9064);
			});
		});
	});
});
