function fakeresponse(){

	this.status= this;

	this.send = function(str){
		console.log(str);
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
