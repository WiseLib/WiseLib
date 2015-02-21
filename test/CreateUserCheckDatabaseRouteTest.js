var should = require('should');
var User = require('../lib/user_test.js');
var server = require('../lib/routes.js');//Every method is still in routes
var dbscheme = require('../lib/db.js');
var Client = require('mariasql');
var fs = require('fs');
var c = new Client();
var configuration = require('../lib/config.js');


/**
 * This test checks the post User and get User route,to test the API.
 * If the query is executed correctly, the test will manually check the user table in the database for the newly added user. 
 * If the user is present,it gets deleted from the database to prevent bloat.
 *  If the user is not available a assertion error gets thrown
 * 
 * @test
 */

 function removeUser(client,id){ //temporary remove user function TODO use the one from route?

 	var query = 'DELETE FROM user where person_id=' + id.toString() + ';';

 	client.query(query);
 	client.on('result', function (res) {
 		res.on('error', function (err) {
 			throw Error(err);
 		})
 	});

 	client.end();
 };

 describe('Create user test', function(){

 	after(function(){
		// runs after all tests in this block
		//user.remove();//Remove test person from database for next tests.
		//TODO Delete user is not yet implemented

		removeUser(c,request.personId);
	})

 	var response =  new User.fakeresponse();
	var request2 = new User.fakerequest("mail@mail.com","password",false);//person does not already exist
	var request = new User.fakerequest("mail@mail.com","password","4");//person exists with id '4'

	describe('Create user', function(){
		it('should create user without error', function(done){

			response.done = done;

			try{
				
				server['/user.json']['post'](request,response);
			}
			catch(x)
			{
				done(x);
			}	
		});
	})

	describe('Test database',function(){
		it('database should contain new user',function(done){
			var query = dbscheme.user.select(dbscheme.user.star())
			.from(dbscheme.user)
			.where(
				dbscheme.user.email_address.like('%' + "mail@mail.com" + '%'));
			try{
				c.query(query.toString())
				.on('result', function (res) {
					res.on('row', function (row) {
						row.should.have.property('email_address', "mail@mail.com");
						row.should.have.property('password',"password");
						if(request.personId) {row.should.have.property('person_id',request.personId.toString());};
					})
					.on('error', function (err) {
						console.log('Result error: ' + err);
						throw err;
					})
					.on('end', function (info) {
						var result = info.numRows;
						if (result < 1){console.log('No results from query ' + query.toString());}
						if (result > 1){console.log('To many results from query ' + query.toString());}
						result.should.be.equal(1);//query should return 1 unique result
						done();

					});
				})
			}
			catch(error){
				done(error);
			}

		})
});
});


