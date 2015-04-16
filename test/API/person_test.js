'use strict';
/**
 * This method belongs to the SearchPersonRoute test. It fakes the response which is edited by the methods, called by the test, in dbmanager.
 * It also incorporates the done function that is necessary for the mocha framework.
 * @return {object} response - A faked response
 */
function fakeresponse(){

	var done = function(){};

	var response;
	var status;

	this.status= function(status){this.status=status;return this;};

	this.json = function(json){
		if(json.persons !== undefined) response = json.persons;
		else response=json;
		this.done();
	};

	this.getresponse= function(){return response;};

	this.end = function(){};
}

/**
 * This method belongs to the SearchPersonRoute test. It fakes the request which will be used by the dbmanager to execute its methods
 * and to create a correct response.
 * @param  {string} firstname - the firstname of the person to be searched
 * @param  {string} lastname -
 * @return {object} request - a faked request
 */
function fakerequest(firstname,lastname){

	this.firstname = firstname;
	this.lastname = lastname;

	this.body = this;

	this.firstName = firstname;
	this.lastName = lastname;

	this.query = {firstName : firstname, lastName : lastname}//linker.js personrepr thing

}

exports.fakeresponse = fakeresponse;
exports.fakerequest = fakerequest;
