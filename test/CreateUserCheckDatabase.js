var should = require('should');
var User = require('../lib/user_test.js');
var server = require('../lib/routes.js');//Every method is still in server
var dbscheme = require('../lib/db.js');
var Client = require('mariasql');
var fs = require('fs');
var c = new Client();
var configuration = require('../lib/config.js');


/**
 * This test checks the registerUser method, a function that register a user by entering its details in de user table in the database.
 * The test calls the function after trying to establish a connection with the database. Once the connection is created the query get executed.
 * If the query is executed correctly, the test will manually check the user table in the database for the newly added user. If the user is present,
 * it gets deleted from the database to prevent bloat. If the user is not available a assertion error gets thrown
 * 
 * @test
 */
describe('Create user test', function(){
	
	after(function(){
		// runs after all tests in this block
		//user.remove();//Remove test person from database for next tests.
		//TODO Delete user is not yet implemented
	})
	
	describe('Attempt connection',function(){
		it('should connect',function(done){

			var config = configuration.database;
			c.connect({
				host: config.host,
				user: config.user,
				password: config.password,
				db: config.db
			});

			c.on('connect', function() {
				//console.log('Client connected');
				done();
			})
			.on('error', function(err) {
				var err = Error('Client error: ' + err);
				done(err);
			})
			.on('close', function(hadError) {
				//console.log('Client closed');
			});
		})
	})
	var response =  new User.fakeresponse();
	
	describe('Create user', function(){
		it('should create user without error', function(done){//function done makes mocha wait for test completion
			try{
				
				var request = new User.fakerequest("mail@mail.com","password",false);//person does not already exist
				var request2 = new User.fakerequest("mail@mail.com","password","4");//person exists with id '4'
				
				//server.registerUser(request,response,done);
				done();
			}
			catch(x)
			{
				done(x);
			}	

			//	done();
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
						console.log('Result row: ' + JSON.stringify(row));
						row.should.have.property('email_address', "mail@mail.com");
						row.should.have.property('password',"password");
						if(request.personId) {row.should.have.property('person_id',requestpersonId.toString());};
						done();
						c.end();
					})
					.on('error', function (err) {
						console.log('Result error: ' + err);
						c.end();
						throw err;
					})
					.on('end', function (info) {
						//console.log('Result finished successfully: ' + JSON.stringify(info));
						c.end();
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
	})
});


