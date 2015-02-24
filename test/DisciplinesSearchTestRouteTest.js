var should = require('should');
var discipline = require('./discipline_test.js');
var server = require('../lib/routes.js');
var Client = require('mariasql');

/**
 * This test checks the getDisiciplines method, a function which returns a list, in JSON format, of a disciplines defined in the database.
 * The the test calls the function, if the function succeeds the answer get compared to the known number of disciplines present in the database.
 * If the returned answer is equal to the known number the test succeeds, if not, an assertion error is thrown.
 * 
 * @test
 */
describe ('Retrieve list of disciplines from server database',function(){
	describe('Retrieve all disciplines',function(){
		var response = new discipline.fakeresponse();
		describe('Execute query',function(){
			it('should excute without error',function(done){

				response.done = done;
				var request = new discipline.fakerequest({});
				try{

					server['/disciplines.json']['get'](request,response);
				}
				catch(x)
				{
					done(x);
				};	
			})
		})
		describe('Analyse response',function(){
			it('should hold correct disciplines',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(69);//for now
			})
		})
	})
	describe('Retrieve discipline with given id',function(){
		var response = new discipline.fakeresponse();
		describe('Execute query',function(){
			it('should excute without error',function(done){

				response.done = done;
				var request = new discipline.fakerequest({id: '1'});
				try{

					server['/disciplines.json']['get'](request,response);
				}
				catch(x)
				{
					done(x);
				};	
			})
		})
		describe('Analyse response',function(){
			it('should hold correct discipline',function(){
				var result = response.result();
				result.should.be.an.object;
				var resultLength = result.length;
				resultLength.should.be.greaterThan(0);
				resultLength.should.be.equal(1);
				result[0].should.have.property('id','1');
				result[0].should.have.property('name','Computer Science');
			})
		})
	})
});
