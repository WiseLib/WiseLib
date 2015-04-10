'use strict';
var should = require('should');
var DBManager = require('../../src/dbmanager.js');
var linker = require('../../src/linker.js');
var config = require('../../config.json');
/**
 * This checks the User related methods defined in the dbmanager. Since every post method has an opposite delete, the database should remain clean
 * @test
 */
describe('DbManager tests', function() {

	var dbmanager = DBManager;
	var result;

	function retrieveBy(repr, parameter, value) {
		describe('Call method', function() {
			it('should execute without error', function(done) {
				var query = new Object;
				query[parameter] = value;
				dbmanager.get(query, repr, function(res) {
					result = res;
					done();
				});
			});
		});
	}

	describe('getPerson', function() {

		describe('Retrieve all Persons', function() {
			retrieveBy(linker.personRepr);
			describe('Analyse result', function() {
				it('result should hold all persons', function() {
					var resultLength = result.length;
					resultLength.should.be.equal(26); //Known amount of persons
				});
			});
		});

		describe('Retrieve person by id', function() {
			var ID = 9000;
			retrieveBy(linker.personRepr, 'id', ID)
			describe('Analyse result', function() {
				it('result should hold correct person', function() {
					result[0].should.be.an.object;
					var resultLength = result.length;
					resultLength.should.be.equal(1);
					result[0].should.have.property('id', ID);
					result[0].should.have.property('firstName', 'Testguy');
					result[0].should.have.property('lastName', 'NietVerwijderen');
				});
			});
		});
		describe('Retrieve person by name', function() {
			retrieveBy(linker.personRepr, 'firstName', 'Jan')
			describe('Analyse result', function() {
				it('result should hold correct persons', function() {
					result.forEach(function(person) {
						person.should.have.property('firstName', 'Jan')
					})
				});
			});
		});
	});

	describe('getUser', function() {
		describe('Retrieve all Users', function() {
			retrieveBy(linker.userRepr)
			describe('Analyse result', function() {
				it('result should hold all persons', function() {
					var resultLength = result.length;
					resultLength.should.be.equal(16); //Known amount of users
				});
			});
		});


		describe('Retrieve user by id', function() {
			var ID = 226
			retrieveBy(linker.userRepr, 'id', ID);
			describe('Analyse result', function() {
				it('result should hold correct person', function() {
					result[0].should.be.an.object;
					var resultLength = result.length;
					resultLength.should.be.equal(1);
					result[0].should.have.property('id', ID);
					result[0].should.have.property('email', 'se@vub.ac.be');
				});
			});
		});

		describe('Retrieve user by person id', function() {
			var ID = 9068
			retrieveBy(linker.userRepr, 'person', ID);
			describe('Analyse result', function() {
				it('result should hold correct person', function() {
					result[0].should.be.an.object;
					var resultLength = result.length;
					resultLength.should.be.equal(1);
					result[0].should.have.property('id', 226);
					result[0].should.have.property('person', ID);
					result[0].should.have.property('email', 'se@vub.ac.be');
				});
			});
		});

		describe('Retrieve user by email', function() {
			retrieveBy(linker.userRepr, 'email', 'se@vub.ac.be');
			describe('Analyse result', function() {
				it('result should hold correct person', function() {
					result[0].should.be.an.object;
					var resultLength = result.length;
					resultLength.should.be.equal(1);
					result[0].should.have.property('id', 226);
					result[0].should.have.property('email', 'se@vub.ac.be');
				});
			});
		});

	});

	describe('post and delete Person', function() {
		var person = {
			firstName: 'TestTest',
			lastName: 'Ikel'
		}
		var response = false;
		describe('Call method', function() {
			it('should execute withour error', function(done) {
				dbmanager.post(person, linker.personRepr, function(res) {
					response = res;
					done();
				});
			});
			it('query should have succeeded', function() {
				if (response) response.should.be.a.number;
				else throw new Error("No response");
			});
		});
		describe('Check database for newly added person', function() {
			var result;
			it('query should search the new person', function(done) {
				dbmanager.get({
					id: response
				}, linker.personRepr, function(res) {
					result = res;
					done();
				});
			});
			it('database should hold the new discipline', function() {

				if (result) {
					result[0].should.have.property('id', response);
					result[0].should.have.property('firstName', 'TestTest');
				} else {
					throw new Error("No result")
				};
			});
		});

		describe('deletePerson method test',function(){
			it('should delete the previously added person',function(done){
				dbmanager.delete({
					id: response
				}, linker.personRepr, function(res) {
					response = res;
					done();
				});
			});
			it.skip('should have deleted without error', function() {
					response.affectedRows.should.be.equal(1);
				});
		});
	});

	describe('post and delete User', function() {
		var user = {
			email: 'TestTest',
			password: 'Ikel',
			person: 9000
		}
		var response = false;
		describe('Call method', function() {
			it('should execute withour error', function(done) {
				dbmanager.post(user, linker.userRepr, function(res) {
					response = res;
					done();
				});
			});
			it('query should have succeeded', function() {
				if (response) response.should.be.a.number;
				else throw new Error("No response");
			});
		});
		describe('Check database for newly added user', function() {
			var result;
			it('query should search the new user', function(done) {
				dbmanager.get({
					id: response
				}, linker.userRepr, function(res) {
					result = res;
					done();
				});
			});
			it('database should hold the new discipline', function() {

				if (result) {
					result[0].should.have.property('id', response);
					result[0].should.have.property('email', 'TestTest');
				} else {
					throw new Error("No result")
				};
			});
		});

		describe('deletePerson method test',function(){
			it('should delete the previously added person',function(done){
				dbmanager.delete({
					id: response
				}, linker.userRepr, function(res) {
					response = res;
					done();
				});
			});
			it.skip('should have deleted without error', function() {
					response.affectedRows.should.be.equal(1);
				});
		});
	});

});