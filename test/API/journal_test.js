'use strict';
/**
 * This method belongs to the JournalSearchTestRouteTest test. It fakes the response which is edited by the methods, called by the test, in dbmanager.
 * It also incorporates the done function that is necessary for the mocha framework.
 * @return {object} response - A faked response
 */
function fakeresponse() {

	var Result;

	var done = function() {};

	this.status = function(stat) {
		return this;
	};

	this.json = function(jsonanswer) {

		if (jsonanswer.hasOwnProperty('journals')) {
			this.Result = jsonanswer.journals.splice(0);
			this.done();
		} else if (jsonanswer.hasOwnProperty('proceedings')) {
			this.Result = jsonanswer.proceedings.splice(0);
			this.done();
		} else {
			this.Result = jsonanswer;
			this.done();
		}
	};

	this.send = function(message) {
		this.Result = message;
		this.done();
	};

	this.result = function() {
		return this.Result;
	};
}


/**
 * This method belongs to the JournalSearchTestRouteTest test . It fakes the request which will be used by the dbmanager to execute its methods
 * and to create a correct response.
 * @param  {object} query - the query should be either empty or have an id field
 * @return {object} request - a faked request
 */
function fakerequest(query) {

	this.query = query;

	this.params = query;

}

exports.fakeresponse = fakeresponse;
exports.fakerequest = fakerequest;