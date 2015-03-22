'use strict';
/**
 * This method belongs to the DisciplineSearch test. It fakes the response which is edited by the methods, called by the test, in dbmanager.
 * It also incorporates the done function that is necessary for the mocha framework.
 * @return {object} response - A faked response
 */

function fakeresponse(){

	var result;

	var done = function(){};

	this.status= function(stat){return this;};

	this.json = function(jsonanswer){
		result = jsonanswer.disciplines.splice(0);
		this.done();
	};

	this.result = function(){return result;};
}


/**
 * This method belongs to the DisciplineSearch test . It fakes the request which will be used by the dbmanager to execute its methods
 * and to create a correct response.
 * @param  {object} query - the query should be either empty or have an id field
 * @return {object} request - a faked request
 */
function fakerequest(Query){

	this.Query= Query;

	this.query = this.Query;
}

exports.fakeresponse=fakeresponse;
exports.fakerequest =fakerequest;