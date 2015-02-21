var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var Discipline = require('../lib/discipline.js');
var config = require('../config.json');

/**
 * This checks the discipline related methods defined in the dbmanager. Since every post method has an opposite delete, the database should remain clean
 * @test
 */

describe('DbManager tests',function(){

	var dbmanager = new DBManager(config.database);//DBManger(host,database)

//getDiscipline method test
	describe('getDisciplines method test',function(){
		var result;
		describe('Retrieve all disciplines',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.getDiscipline({},function(res){result= res;done();})
				})
			})
			describe('Analyse result',function(){
				it('result should hold all disciplines',function(){
					resultLength = result.length;
					resultLength.should.be.equal(69);//Known amount of disicplines
				})
			})
		})
		describe('Retrieve disicpline by id',function(){
			var ID = '1';
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.getDiscipline({id: ID},function(res){result= res;done();})
				})
			})
			describe('Analyse result',function(){
				it('result should hold correct discipline',function(){
					result[0].should.be.an.object;
					resultLength = result.length;
					resultLength.should.be.equal(1);
					result[0].should.have.property('id',ID);
					result[0].should.have.property('name','Computer Science');
				})
			})
		})
		describe('Retrieve discipline group by parentID',function(){
			var parentID = '60';
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.getDiscipline({parentId: parentID},function(res){result= res;done();})
				})
			})
			describe('Analyse result',function(){
				it('result should hold correct discipline',function(){
					//console.log(result);
					result.should.be.an.Array;
					result.forEach(function(disc){
						disc.should.have.properties('id','name','parent');
						disc.parent.should.have.property('id',parentID);
					});
				})
			})
		})
	});
	//putDiscipline method test
	describe('putDiscipline method test',function(){
		var response;
		var discipline;//TODO correcte discipline object aanmaken
		describe('Call method',function(){
			it('should execute withour error',function(done){
				dbmanager.putDiscipline({}, function(res) {response = res, done()});
			})
		})
		describe('Check database for updated disicpline',function(){
			it('discipline should be updated',function(done){
				throw new Error("NYI"); //TODO complete
			})
		})
	});
	//post/deleteDiscipline
	describe ('Post and Delete discipline test',function(){
		var response;
		var parentDiscipline = {name: 'TestDiscipline' , parentId: '1'};//discipline with parent
		var discipline = {name:'TestDiscipline' , parentId : 'NULL' }; //discipline without parent

		describe('postDiscipline method test',function(){

			describe('Call method',function(){
				it('should execute withour error',function(done){
					dbmanager.postDiscipline(parentDiscipline, function(res) {response = res; done();});
				})
				it('query should have succeeded',function(){
					response.should.be.a.number;
				})
			})
			describe('Check database for newly added disicpline',function(){
				var result;
				it('query should search the new discipline',function(done){
					dbmanager.getDiscipline({id: response.toString()},function(res){result= res;done();}) 
				});
				it('database should hold the new discipline',function(){
					result[0].should.have.property('id',response.toString());
					result[0].should.have.property('name','TestDiscipline');
				})
			})
		});
		describe('deleteDisicipline method test',function(){
			it('should now delete the previously added discipline',function(done){
				dbmanager.deleteDiscipline({id:response.toString()},function(res){response = res; done();})
			})
			it('should have deleted without error',function(){
				response.affectedRows.should.be.equal(1);
			})
		});
	});
});