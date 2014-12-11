var should = require('should');
var Person = require('../lib/person_test.js');
var server = require('../lib/routes.js');//Every method is still in server
var dbscheme = require('../lib/db.js');
var Client = require('mariasql');


/**
 * This test checks the searchPerson method, a function that searches a person given a first and last name.
 *  The test works by calling the function with a known unique person in the database. First a connection to the database is attempted.
 *  If the function succeeds the result gets compared to the known details about the person entry. If the response matches up the test succeeds,
 *  if not an assertion error gets thrown.
 *  
 *  @test
 * 
 */
describe('Search person in database test',function(){
	var result = new Person.fakeresponse();
	var request = new Person.fakerequest("Jan","Modaal");
	describe('Send query to database',function(){
		it('should not error',function(done){

			result.done = done;
			
			try{
				server['/person']['get'](request,result)
			}
			catch(x){
				done(x);
			};


		})
	})
	describe('Analyse response',function(){
		it('should hold the correct persons',function(){
			result.getresponse().should.not.be.empty;
			result.getresponse().map(function(x){x.should.have.property('first_name',request.firstName)});
			result.getresponse().map(function(x){x.should.have.property('last_name',request.lastName)});

		})
	})

});
