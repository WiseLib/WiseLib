var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var config = require('../config.json');
/**
 * This checks the User related methods defined in the dbmanager. Since every post method has an opposite delete, the database should remain clean
 * @test
 */
describe('DbManager tests',function(){	

	var dbmanager = new DBManager(config.database);//DBManger(host,database)

	describe('getPerson',function(){

	});

	describe('getUser',function(){

	});

	describe('postPerson',function(){

	});

	describe('postUser',function(){

	});

});