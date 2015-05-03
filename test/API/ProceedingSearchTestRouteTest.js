'use strict';
var should = require('should');
var discipline = require('./discipline_test.js')
var journal = require('./journal_test.js');
var server = require('../../src/communication/routesFunctions.js');

/**
 * This test checks the getJournals method, a function that return a list, in JSON format, of all conferences present in the database.
 * The the test calls the function, if the function succeeds the answer get compared to the known number of conferences present in the database.
 * If the returned answer is equal to the known number the test succeeds, if not, an assertion error is thrown. This method reuses the Journal 
 * fake requests and responses as they are very alike
 *
 * @test
 */
describe ('Retrieve list of conferences from server database',function(){
	describe('Retrieve all conferences',function(){
		var response = new journal.fakeresponse();
		describe('Execute function',function(){
			it('should excute without error',function(done){
				this.timeout(5000);
				response.done=done;
				var request = new journal.fakerequest({});
				try{
					server.getProceedings(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct conferences',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(4068);
			});
		});
	});
	describe('Retrieve conference with given id',function(){
		var response = new journal.fakeresponse();
		describe('Execute function',function(){
			it('should excute without error',function(done){

				response.done=done;
				var request = new journal.fakerequest({id: '8'});
				try{
					server.getProceeding(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct conferences',function(){
				var result = response.result();
				result.should.be.an.object;
				result.should.have.property('id',8);
				result.should.have.property('name','Proceedings of the ACM SIGACT-SIGMOD-SIGART Symposium on Principles of Database Systems');
			});
		});
	});
	describe('Retrieve disciplines of a given conference',function(){
		var response = new discipline.fakeresponse();
		describe('Execute function',function(){
			it('should execute withour error',function(done){
				response.done=done;
				var request = new journal.fakerequest({id: 8});
				try{
					request.query={};//we only want params to have the id
					server.getProceedingDisciplines(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct conferences',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(3)
				result[0].should.have.property('id',6);
				result[1].should.have.property('id',11);
				result[2].should.have.property('id',48);
			});
		});
	});
});
