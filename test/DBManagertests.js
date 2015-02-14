var should = require('should');
var DBManager = require('../lib/dbmanager.js');
var config = require('../config.json');

/**
 * This checks the executeQuery methods defined in the dbmanager.
 * @test
 */
describe('DbManager test',function(){

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
	
});
