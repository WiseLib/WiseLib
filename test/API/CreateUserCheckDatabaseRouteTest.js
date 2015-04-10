'use strict';
var should = require('should');
var User = require('./user_test.js');
var server = require('../../src/routesFunctions.js');//Every method is still in routes
var Client = require('mariasql');
var c = new Client();
var configuration = require('../../config.json')

/**
 * This test checks the post User route,to test the API.
 * If the query is executed correctly, the test will manually check the user table in the database for the newly added user.
 * If the user is present,it gets deleted from the database to prevent bloat.
 * If the user is not available a assertion error gets thrown
 *
 * @test
 */

 function removeUser(id){ //temporary remove user function TODO use the one from route?

 	var query = 'DELETE FROM user where person_id=' + id.toString() + ';';

 	c.query(query);
 	c.on('result', function (res) {
 		res.on('error', function (err) {
 			throw Error(err);
 		});
 	});

 	c.end();
 }

 describe('Create user test', function(){

 	after('Delete user',function(){
		// runs after all tests in this block
		//user.remove();//Remove test person from database for next tests.
		//TODO Delete user is not yet implemented

		removeUser(request.personId);
	});

 	describe('Attempt connection',function(){//create connection to look up the newly created person in the database
 		it('should connect',function(done){

 			var config = configuration.database;
 			c.connect({
 				host: config.host,
 				user: config.user,
 				password: config.password,
 				db: config.db
 			});

 			c.on('connect', function() {
 				done();
 			})
 			.on('error', function(err) {
 				var err = Error('Client error: ' + err);
 				done(err);
 			});
 		});
 	});

 	var response =  new User.fakeresponse();
	var request2 = new User.fakerequest('mail.com','password',false);//person does not already exist
	var request = new User.fakerequest('mail.com','password',9000);//person exists with id '4'

	describe('Create user', function(){
		it('should create user without error', function(done){

			response.done = done;

			try{

				server.postUser(request,response);

			}
			catch(x)
			{
				done(x);
			}
		});
	});

	describe('Test database',function(){
		it('should contain new user',function(done){

			var query = 'SELECT * FROM user WHERE email_address LIKE "' + request.body.email + '";';
			c.query(query)
			.on('result', function (res) {

				res.on('row',function(row){

					row.should.have.property('email_address', 'mail.com');
					row.should.have.property('password','password');
					if(request.personId) {row.should.have.property('person_id',request.personId.toString());}
					else{request.personId = row.person_id};
				});

				res.on('error', function (err) {
					throw Error(err);
				});

				res.on('end',function(info){

				var result = info.numRows;
				if (result < 1){console.log('No results from query ' + query.toString());}
				if (result > 1){console.log('To many results from query ' + query.toString());}
						result.should.be.equal(1);//query should return 1 unique result
						done();
					});
			})

			.on('end',function(){});
		});
	});
});


