var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var Client = require('mariasql');
var fs = require('fs');
var config = require('../config.json');
/**
 * This checks the Publication related methods defined in the dbmanager. Since every post method has an opposite delete, the database should remain clean
 * @test
 */
describe('DbManager tests',function(){

	var dbmanager = new DBManager(config.database);//DBManger(host,database)
	
	describe('postPublication',function(){

	});

	describe('postJournalPublication',function(){

	});

	describe('postProceedingPublication',function(){

	});

});
