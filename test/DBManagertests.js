var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var dbscheme = require('../lib/db.js');
var Discipline = require('../lib/discipline.js');
var Client = require('mariasql');
var fs = require('fs');
var config = require('../lib/config.js');


//var c = new Client();

describe('DbManager tests',function(){

	/*
	//Connection in test so mocha waits
	describe ('Attempt connection',function(){
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
	});
	 */
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
		describe('Check database for newly added disicpline',function(){
			it('database should hold new discipline',function(done){
				done(); //TODO complete
			})
		})
	});
	//post/deleteDiscipline
	describe ('Post and Delete discipline test',function(){
		var response;

		var parentDiscipline = new Discipline('Computer Science');
		parentDiscipline.id = 1;
		var discipline = new Discipline('TestDiscipline'); //discipline with parent

		//var discipline2 = {name: 'TestDiscipline' }; //discipline without parent
		//discipline2.parent = discipline2;

		parentDiscipline.addChild(discipline);

		describe('postDiscipline method test',function(){

			describe('Call method',function(){
				it('should execute withour error',function(done){
					//dbmanager.postDiscipline(discipline, function(res) {response = res; done();});
					done();
				})
				it('query should have succeeded',function(){
					//TODO check post discipline retrun info
				})
			})
			describe('Check database for newly added disicpline',function(){
				var result = [];
				it('database should search the new discipline',function(done){
					dbmanager.Discipline({id: ID},function(res){result= res;done();}) //ID from response not yet implemented
					done(); 
				});
				it('database should hold the new disicipline',function(){
					result[0].should.be.an.object;
					result[0].should.have.property('id',ID);
					result[0].should.have.property('name','TestDiscipline');
				})
			})
		});
		describe('deleteDisicipline method test',function(){
			it('should now delete the previously added discipline',function(done){
				//dbmanager.deleteDiscipline(discipline,function(res){response = res; done();})
				done();
			})
			it('should have deleted without error',function(){
				//TODO check return info when implemented
			})
		});
	});

});
