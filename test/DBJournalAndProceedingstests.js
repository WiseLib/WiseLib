var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var config = require('../config.json');
/**
 * This checks the Journal and Proceeding related methods defined in the dbmanager. Since every post method has an opposite delete, the database should remain clean
 * @test
 */

describe('DbManager tests',function(){

	var dbmanager = new DBManager(config.database);//DBManger(host,database)

	describe('getJournal',function(){
		var result;
		describe('Retrieve all Journals',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.getJournal({},function(res){result= res;done();})
				})
			})
			describe('Analyse result',function(){
				it('result should hold all disciplines',function(){
					resultLength = result.length;
					resultLength.should.be.equal(1066);//Known amount of journals
				})
			})
		})
	

	describe('Retrieve journal by id',function(){
			var ID = '24';
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.getJournal({id: ID},function(res){result= res;done();})
				})
			})
			describe('Analyse result',function(){
				it('result should hold correct journal',function(){

					var journal = result[0]

					journal.should.be.an.object;
					resultLength = result.length;
					resultLength.should.be.equal(1);
					journal.should.have.property('id',ID);
					journal.should.have.property('name','Semantic Web');
					journal.should.have.property('rank','3.871');

					journal.should.have.property('disciplines');
					var disciplines = journal.disciplines;
					disciplines[0].should.have.property('id','7');
					disciplines[1].should.have.property('id','16');
					disciplines[2].should.have.property('id','48');
				})
			})
		})

	});

	describe('putJournal',function(){
 	//TODO
	});

	describe('postJournal/deleteJournal',function(){
		var response = 7;
		var journal = {name:'TestJournal' , rank: '0',disciplines:[{id:'1'}]};

		describe('postJournal method test',function(){

			describe('Call method',function(){
				it('should execute withour error',function(done){
					//dbmanager.postJournal(journal, function(res) {response = res; done();});//repsonse holds id 
					done(new Error("Not executed"));
				})
				it('query should have succeeded',function(){
					response.should.be.a.number;
				})
			})
			describe('Check database for newly added disicpline',function(){
				var result;
				it('query should search the new discipline',function(done){
					dbmanager.getJournal({id: response.toString()},function(res){result= res;done();}) 
				});
				it('database should hold the new discipline',function(){throw new Error("remove this error if deleteJournal is implemented")
					result[0].should.have.property('id',response.toString());
					result[0].should.have.property('name','TestJournal');
					result[0].should.have.property('rank','0');
				})
			})
		});
		describe('deleteJournal method test',function(){
			it('should now delete the previously added discipline',function(done){
				dbmanager.deleteJournal({id:response.toString()},function(res){response = res; done();})
			})
			it('should have deleted without error',function(){
				//response.affectedRows.should.be.equal(1);
			})
		});
	});

	describe('getProceeding',function(){
		var result;
		describe('Retrieve all Poceedings',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.getProceeding({},function(res){result= res;done();})
				})
			})
			describe('Analyse result',function(){
				it('result should hold all disciplines',function(){
					//resultLength = result.length;
					//resultLength.should.be.equal(0);//Known amount of Proceedigns
				})
			})
		})

	});

	describe('putProceeding',function(){
		//TODO
	});

	describe('postProceeding/deleteProceeding',function(){
		var response = 7;
		var proceeding = {name:'TestProceeding' , rank: '0',disciplines:[{id:'1'}]};

		describe('postProceeding method test',function(){

			describe('Call method',function(){
				it('should execute withour error',function(done){
					//dbmanager.postProceeding(proceeding, function(res) {response = res; done();});//repsonse holds id 
					done(new Error("Not executed"));
				})
				it('query should have succeeded',function(){
					response.should.be.a.number;
				})
			})
			describe('Check database for newly added disicpline',function(){
				var result;
				it('query should search the new discipline',function(done){
					dbmanager.getProceeding({id: response.toString()},function(res){result= res;done();}) 
				});
				it('database should hold the new discipline',function(){throw new Error("remove this error if deleteProceeding is implemented")
					result[0].should.have.property('id',response.toString());
					result[0].should.have.property('name','TestProceeding');
					result[0].should.have.property('rank','0');
				})
			})
		});
		describe('deleteProceeding method test',function(){
			it('should now delete the previously added discipline',function(done){
				dbmanager.deleteProceeding({id:response.toString()},function(res){response = res; done();})
			})
			it('should have deleted without error',function(){
				//response.affectedRows.should.be.equal(1);
			})
		});
	});

});