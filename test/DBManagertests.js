var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var dbscheme = require('../lib/db.js');
var Discipline = require('../lib/discipline.js');
var Client = require('mariasql');
var fs = require('fs');
var config = require('../lib/config.js');

/**
 * This checks all methods defined in the dbmanager. Since every post method has an opposite, the database should remain clean
 * @test
 */
describe('DbManager tests',function(){

	var dbmanager = new DBManager(config.database);//DBManger(host,database)

	//executeQuery method test
	describe('Execute query test',function(){
		var exitstatus;
		var queryresult = [];
		describe('Execute query',function(){
			it('should execute the query without error',function(done){

				var OnSucces = function(result){
					//onSucces
					result.on('row', function (row) {
						if (Array.isArray(queryresult)){
							if(queryresult.length == 0){
								queryresult = row;}
							else {
								queryresult.push(row);
							}
						}
						else{
							var temp = queryresult
							queryresult = [];
							queryresult.push(temp);
							queryresult.push(row);}
					})
					.on('error', function (err) {
						exitstatus = "failed";
						throw err;
					})
					.on('end', function (info) {
						done();
						exitstatus = "succeed";
					});
				};
				//Syntax :: executequery(user,password,query,queryparameters,onesucces,onserror
				dbmanager.executeQuery('SELECT * FROM person WHERE first_name = "Testguy"', undefined,OnSucces, 
						function(err){//onError
					exitstatus = "failed";
					throw err;
					done();
				})
			})
		})
		describe('Analyse query result',function(){
			it('exitstatus should be as expected',function() {
				exitstatus.should.be.equal("succeed");
			});
			it('Response should be as expected',function(){
				queryresult.should.have.property('first_name',"Testguy");
				queryresult.should.have.property('last_name', "NietVerwijderen");
				queryresult.should.have.property('id','9000')
			});
		})
	});
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
				done(); //TODO complete
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
				it('database should search the new discipline',function(done){
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
				//TODO check return info when implemented
			})
		});
	});

	describe('getJournal',function(){

	});

	describe('putJournal',function(){

	});

	describe('postJournal/deleteJournal',function(){

	});

	describe('getProceeding',function(){

	});

	describe('putProceeding',function(){

	});

	describe('postProceeding/deleteProceeding',function(){

	});

	describe('postPublication',function(){

	});

	describe('postJournalPublication',function(){

	});

	describe('postProceedingPublication',function(){

	});

	describe('getPerson',function(){

	});

	describe('getUser',function(){

	});

	describe('postPerson',function(){

	});

	describe('postUser',function(){

	});
});
