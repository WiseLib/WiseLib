'use strict';
var should = require('should');
var discipline = require('./discipline_test.js')
var journal = require('./journal_test.js');
var server = require('../../src/communication/routesFunctions.js');

/**
 * This test checks the getJournals method, a function that return a list, in JSON format, of all journals present in the database.
 * The the test calls the function, if the function succeeds the answer get compared to the known number of journals present in the database.
 * If the returned answer is equal to the known number the test succeeds, if not, an assertion error is thrown.
 *
 * @test
 */
describe ('Retrieve list of journals from server database',function(){
	describe('Retrieve all journals',function(){
		var response = new journal.fakeresponse();
		describe('Execute function',function(){
			it('should excute without error',function(done){

				response.done=done;
				var request = new journal.fakerequest({});
				try{
					server.getJournals(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct journals',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(1271);//Not all journals have an academic discipline?
			});
		});
	});
	describe('Retrieve journal with given id',function(){
		var response = new journal.fakeresponse();
		describe('Execute function',function(){
			it('should excute without error',function(done){

				response.done=done;
				var request = new journal.fakerequest({id: '7'});
				try{
					server.getJournal(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct journal',function(){
				var result = response.result();
				result.should.be.an.object;
				result.should.have.property('id',7);
				result.should.have.property('name','Foundations and Trends in Machine Learning');
			});
		});
	});
	describe('Retrieve disciplines of a given journal',function(){
		var response = new discipline.fakeresponse();
		describe('Execute function',function(){
			it('should execute withour error',function(done){
				response.done=done;
				var request = new journal.fakerequest({id: 7});
				try{
					request.query={};//we only want params to have the id
					server.getJournalDisciplines(request,response);
				}
				catch(x)
				{
					done(x);
				}
			});
		});
		describe('Analyse response',function(){
			it('should hold correct journals',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(3)
				result[0].should.have.property('id',11);
				result[1].should.have.property('id',13);
				result[2].should.have.property('id',50);
			});
		});
	});
});
