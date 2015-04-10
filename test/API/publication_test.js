'use strict';
/**
 * This method belongs to the SearchPublicationRoute test. It fakes the response which is edited by the methods, called by the test, in dbmanager.
 * It also incorporates the done function that is necessary for the mocha framework.
 * @return {object} response - A faked response
 */
function fakeresponse(){

	var done = function(){};

	var response;

	this.status= function(x){return this;};

	this.json = function(json){
		if(json.publications !== undefined) response = json.publications;
		else response=json
		this.done();
	};

	this.getresponse= function(){return response;};
}
/**
 * This method belongs to the SearchPunblicationRoute test. It fakes the request which will be used by the dbmanager to execute its methods
 * and to create a correct response.
 * @param  {string} firstname - the firstname of the person to be searched
 * @param  {string} lastname -
 * @return {object} request - a faked request
 */
function fakerequest(param){

	this.params=param;

	this.body = this;

	this.query= new Object;

}


exports.fakeresponse = fakeresponse;
exports.fakerequest = fakerequest;
