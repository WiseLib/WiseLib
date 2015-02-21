function fakeresponse(){
	
	var Result;
	
	var done = function(){};
	
	this.status= function(stat){return this};

	this.json = function(jsonanswer){
		
		if(jsonanswer.hasOwnProperty('journals'))
		{
		   
		this.Result = jsonanswer.journals.splice(0);
		this.done();
		}
		else {
			this.Result = jsonanswer;
			this.done();
		}
	};
	
	this.send = function(message){
		this.Result = message;
		this.done();
	}

	this.result = function(){return this.Result;}
};

function fakerequest(query){

	this.query=query;
	
	this.params = query;

};	

exports.fakeresponse=fakeresponse;
exports.fakerequest =fakerequest
