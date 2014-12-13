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

function fakerequest(mail,password,id){

	this.mail=mail;
	this.password=password;
	this.id=id;

	this.body =this;

	this.email= this.mail;

	this.personId= this.id;
	
	this.firstName= "Test"; //Not split up in server
	this.lastName = "Man"; //Not split up in server

};	

exports.fakeresponse=fakeresponse;
exports.fakerequest =fakerequest
