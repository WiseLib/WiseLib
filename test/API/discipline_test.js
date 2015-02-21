function fakeresponse(){
	
	var result;

	var done = function(){};
	
	this.status= function(stat){return this};

	this.json = function(jsonanswer){
		result = jsonanswer.disciplines.splice(0);
		this.done();
	};

	this.result = function(){return result;}
};

function fakerequest(Query){
	
	this.Query= Query;

	this.query = this.Query
};	

exports.fakeresponse=fakeresponse;
exports.fakerequest =fakerequest