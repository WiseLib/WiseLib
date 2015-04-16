'use strict';
/**
 * This method belongs to the CreateUserCheckDatabse test. It fakes the response which is edited by the methods, called by the test, in dbmanager.
 * It also incorporates the done function that is necessary for the mocha framework.
 * @return {object} response - A faked response
 */
 function fakeresponse(){

 	var done = function(){};
 	this.status = function(){return this;}

 	this.result;

 	this.json = function(json){
 		this.result = json;
		//console.log(id);
		this.done();
	};

	this.end = function(){};
}

/**
 * This method belongs to the CreateUserCheckDatabse test. It fakes the request which will be used by the dbmanager to execute its methods
 * and to create a correct response.
 * @param  {string} mail - the emailadress to add
 * @param  {string} password
 * @param  {[type]} id - undefined if new person, personID if person already exists
 * @return {object} request - a faked request
 */
 function fakerequest(mail,password,id){

 	this.body={
 		email:mail,
 		password:password,
 		person:id,
 	};

 }

 exports.fakeresponse=fakeresponse;
 exports.fakerequest =fakerequest;
