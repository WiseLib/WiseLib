/**
 * This method belongs to the CreateUserCheckDatabse test file. It fakes the response which is edited by the methods, called by the test, in dbmanager.
 * It also incorporates the done function that is necessary for the mocha framework.
 * @return {object} response - A faked response
 */
function fakeresponse(){

	var done = function(){};
	this.status= this;

	this.id

	this.json = function(id){
		this.id = id;
		//console.log(id);
		this.done();
	};

	
};

/**
 * This method belongs to the CreateUserCheckDatabse test file. It fakes the request which will be used by the dbmanager to execute its methods
 * and to create a correct response.
 * @param  {string} mail - the emailadress to add
 * @param  {string} password 
 * @param  {[type]} id - undefined if new person, personID if person already exists
 * @return {object} request - a faked request
 */
function fakerequest(mail,password,id){

	this.mail=mail;
	this.password=password;
	this.id=id;

	this.body =this;

	this.email= this.mail;

	this.personId= this.id;

};	

exports.fakeresponse=fakeresponse;
exports.fakerequest =fakerequest
