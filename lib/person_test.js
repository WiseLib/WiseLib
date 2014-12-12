
function Person(firstName,lastName,birthDate,disciplines,affiliationId,publications){
	this.firstName = firstName
	this.lastName = lastName
	this.birthDate = birthDate
	this.disciplines = disciplines
	this.affiliationId = affiliationId
	this.publications = publications
	
	this.create = function(){
		console.log("Person created")
	};
	this.remove = function(){
		console.log("Person deleted")
	};
};

exports.Person = Person;

function fakeresponse(){
	
	var done = function(){};
	
	var response = [];

	this.status= function(x){return this;};

	this.json = function(json){
		response = json.persons;
		this.done();
	};
	
	this.getresponse= function(){return response;};
};

function fakerequest(firstname,lastname){

	this.firstname=firstname;
	this.lastname=lastname;

	this.body =this;
	
	this.firstName= firstname;
	this.lastName = lastname;

	this.query = {firstName : firstname, lastName : lastname}//linker.js personrepr thing
	

};	

exports.fakeresponse=fakeresponse;
exports.fakerequest =fakerequest;
