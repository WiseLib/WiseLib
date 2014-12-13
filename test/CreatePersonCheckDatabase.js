var should = require('should');
var Person = require('../lib/person_test.js');
var dbscheme = require('../lib/db.js');
var Client = require('mariasql');
var server = require('../lib/routes.js')
var fs = require('fs');
var c = new Client();
var config = require('../lib/config.js');

/**
 *	TODO
 * [description]
 * @param  {[type]}
 * @return {[type]}
 */
describe('Create person test',function(){

	after(function(){
		// runs after all tests in this block
		//person.remove();//Remove test person from database for next tests.
	})

	describe('Attempt connection',function(){
		it('should connect',function(done){

			c.connect({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password,
				db: config.database.db
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
	});

	var request;
	var response;

	describe ('Create person without error',function(){
		it('should create a person without error',function(done){
			try{
				
				server['/persons']['post'](request,response);
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
					c.end();//TODO put c.end in person remove function
				})
				.on('error', function (err) {
					console.log('Result error: ' + err);
					c.end();//TODO put c.end in person remove function
					throw err;

				})
				.on('end', function (info) {
					c.end();//TODO put c.end in person remove function
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

