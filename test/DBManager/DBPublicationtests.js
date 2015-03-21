var should = require('should');
var DBManager = require('../../src/dbmanager.js');
var linker = require('../../src/linker.js')
var config = require('../../config.json');
/**
 * This checks the Publication related methods defined in the dbmanager. Since every post method has an opposite delete, the database should remain clean
 * @test
 */
 describe('DbManager tests',function(){

	var dbmanager = new DBManager(config.database);//DBManger(host,database)

	describe('getPublication',function(){
		var result;
		describe('Retrieve all publications',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.get({},linker.publicationRepr,function(res){result= res;done();});
				});
			});
			describe('Analyse result',function(){
				it('result should hold all publications',function(){
					resultLength = result.length;
					resultLength.should.be.equal(13);//TODO update value
				});
			});
		});

		describe('Retrieve publication by id',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.get({id:2},linker.publicationRepr,function(res){result= res;done();});
				});
			});
			describe('Analyse result',function(){
				it('result should hold correct publication',function(){
					resultLength = result.length;
					resultLength.should.be.equal(1);
					result[0].should.have.property('id',2);
					result[0].should.have.property('title','test');
					result[0].should.have.property('uploader',172);
				});
			});
		});

		describe('Retrieve publication by name',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.get({title:'test'},linker.publicationRepr,function(res){result= res;done();});
				});
			});
			describe('Analyse result',function(){
				it('result should hold correct publications',function(){
					resultLength = result.length;
					resultLength.should.be.equal(2);
					result[0].should.have.property('id',2);
					result[0].should.have.property('title','test');
					result[0].should.have.property('uploader',172);
				});
			});
		});

		describe('Retrieve publication by author',function(){
			describe('Call method',function(){
				it('should execute without error',function(done){
					dbmanager.get({uploader:172},linker.publicationRepr,function(res){result= res;done();});
				});
			});
			describe('Analyse result',function(){
				it('result should hold correct publications',function(){
					resultLength = result.length;
					resultLength.should.be.equal(13);
					result[0].should.have.property('id',2);
					result[0].should.have.property('title','test');
					result[0].should.have.property('uploader',172);
					result[1].should.have.property('id',4);
					result[1].should.have.property('title','test');
					result[1].should.have.property('uploader',172);
				});
			});
		});

	});

	describe('postPublication',function(){

	});

	describe('postJournalPublication',function(){

	});

	describe('postProceedingPublication',function(){

	});

});
