'use strict';
var should = require('should');
var DBManager = require('../../src/dbmanager.js');
var linker = require('../../src/linker.js');
/**
 * This checks the Journal and Proceeding linker representations with the methods defined in the dbmanager.
 * Since every post method has an opposite delete, the database should remain clean
 * @test
 */

describe('DbManager tests', function() {

	var dbmanager = DBManager;

	describe('getJournal', function() {
		var result;
		describe('Retrieve all Journals', function() {
			describe('Call method', function() {
				it('should execute without error', function(done) {
					dbmanager.get({}, linker.journalRepr, function(res) {
						result = res;
						done();
					});
				});
			});
			describe('Analyse result', function() {
				it('result should hold all disciplines', function() {
					var resultLength = result.length;
					resultLength.should.be.equal(1271); //Known amount of journals
				});
			});
		});


		describe('Retrieve journal by id', function() {
			var ID = 24;
			describe('Call method', function() {
				it('should execute without error', function(done) {
					dbmanager.get({
						id: ID
					}, linker.journalRepr, function(res) {
						result = res;
						done();
					});
				});
			});
			describe('Analyse result', function() {
				it('result should hold correct journal', function() {

					var journal = result[0];

					journal.should.be.an.object;
					var resultLength = result.length;
					resultLength.should.be.equal(1);
					journal.should.have.property('id', ID);
					journal.should.have.property('name', 'Semantic Web');
					journal.should.have.property('rank', 3.871);

					journal.should.have.property('disciplines');
					var disciplines = journal.disciplines;
					disciplines[0].should.have.property('id', 7);
					disciplines[1].should.have.property('id', 16);
					disciplines[2].should.have.property('id', 48);
				});
			});
		});

	});

	describe('putJournal', function() {
		//TODO
	});

	
	describe.skip('postJournal/deleteJournal',function(){
		//var response = 7;
		var journal = {name:'TestJournal' , rank: '0',disciplines:[{id:'1'}]};

		describe('postJournal method test',function(){

			describe('Call method',function(){
				it('should execute withour error',function(done){
					dbmanager.post(journal,linker.journalRepr ,function(res) {response = res; done();});//repsonse holds id
					//done(new Error("Not executed"));
				});
				it('query should have succeeded',function(){
					response.should.be.a.number;
				});
			});
			describe('Check database for newly added journal',function(){
				var result;
				it('query should search the new journal',function(done){
					dbmanager.get({id: response},linker.journalRepr,function(res){result= res;done();});
				});
				it('database should hold the new discipline',function(){//throw new Error("remove this error if deleteJournal is implemented")
					result[0].should.have.property('id',response);
					result[0].should.have.property('name','TestJournal');
					result[0].should.have.property('rank',0);
				});
			});
		});
		describe('deleteJournal method test',function(){
			it('should now delete the previously added journal',function(done){
				dbmanager.delete({id:response},linker.journalRepr,function(res){response = res; done();});
			});
			it('should have deleted without error',function(){
				//response.affectedRows.should.be.equal(1);
			});
		});
	});

	describe('getProceeding', function() {
		var result;
		describe('Retrieve all Poceedings', function() {
			describe('Call method', function() {
				it('should execute without error', function(done) {
					dbmanager.get({}, linker.proceedingRepr, function(res) {
						result = res;
						done();
					});
				});
			});
			describe('Analyse result', function() {
				it('result should hold all disciplines', function() {
					//resultLength = result.length;
					//resultLength.should.be.equal(0);//Known amount of Proceedigns
				});
			});
		});

	});

	describe('putProceeding', function() {
		//TODO
	});

	
	describe.skip('postProceeding/deleteProceeding',function(){
		var response = 7;
		var proceeding = {name:'TestProceeding' , rank: '0',disciplines:[{id:'1'}]};

		describe('postProceeding method test',function(){

			describe('Call method',function(){
				it('should execute withour error',function(done){
					dbmanager.post(proceeding,linker.proceedingRepr ,function(res) {response = res; done();});//repsonse holds id
					//done(new Error("Not executed"));
				});
				it('query should have succeeded',function(){
					response.should.be.a.number;
				});
			});
			describe('Check database for newly added proceeding',function(){
				var result;
				it('query should search the new proceeding',function(done){
					dbmanager.get({id: response.toString()},linker.proceedingRepr,function(res){result= res;done();});
				});
				it('database should hold the new proceeding',function(){//throw new Error("remove this error if deleteProceeding is implemented")
					result[0].should.have.property('id',response);
					result[0].should.have.property('name','TestProceeding');
					result[0].should.have.property('rank',0);
				});
			});
		});
		describe('deleteProceeding method test',function(){
			it('should now delete the previously added proceeding',function(done){
				dbmanager.delete({id:response.toString()},linker.proceedingRepr,function(res){response = res; done();});
			});
			it('should have deleted without error',function(){
				//response.affectedRows.should.be.equal(1);
			});
		});
	});
});