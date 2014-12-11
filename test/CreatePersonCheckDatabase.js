/*var should = require('should');
var Person = require('../lib/person_test.js');
var dbscheme = require('../lib/db.js');
var sql = require('sql');
var Client = require('mariasql');
var fs = require('fs');
var c = new Client();
var fs = require('fs');
var config = require('../lib/config.js');


describe('Create person test',function(){

	after(function(){
		// runs after all tests in this block
		//person.remove();//Remove test person from database for next tests.
	})

	describe('Attempt connection',function(){
		it('should connect',function(done){

			c.connect({
				host: config.host,
				user: config.user,
				password: config.password,
				db: config.db
			});

			c.on('connect', function() {
				console.log('Client connected');
				done();
			})
			.on('error', function(err) {
				console.log('Client error: ' + err);
				done();
			})
			.on('close', function(hadError) {
				console.log('Client closed');
			});
		})
	})
	describe ('Create person without error',function(){
		it('should create a person without error',function(done){
			try{
				//server.registerPerson();//server method still has wrong name

				done();
			}
			catch(x)
			{
				done(x);
			}
		});
	})

	describe ('Test database',function(){
		it('database should contain new person',function(done){
			var query = dbscheme.person.select(dbscheme.person.star())
			.from(dbscheme.person)
			.where(
					dbscheme.person.first_name.like('%' + "Test" + '%')
					.and(dbscheme.person.last_name.like('%' + "Man" + '%')));
			c.query(query.toString())
			.on('result', function (res) {
				res.on('row', function (row) {
					console.log('Result row: ' + JSON.stringify(row));
					row.should.have.property('first_name', "Test");
					row.should.have.property('last_name',"Man");
					done();
					c.end();
				})
				.on('error', function (err) {
					console.log('Result error: ' + err);
					c.end();
					throw err;

				})
				.on('end', function (info) {
					console.log('Result finished successfully: ' + JSON.stringify(info));
					c.end();
					var result = info.numRows;
					if (result < 1){console.log('No results from query ' + query.toString());}
					if (result > 1){console.log('To many results from query ' + query.toString());}
					result.should.not.be.lessThan(1)//query expects results
					done();

				});
			})


		})
	})
});
*/
