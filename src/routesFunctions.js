'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 //var validator = require('./validator.js'); //Not used yet
 var DBManager = require('./dbmanager.js');
 var config = require('./config.js');
 var linker = require('./linker.js');
 var imageSaver = require('./imagesaver.js');
 var filehandler = require('./filehandler.js');

 //For login
 var jwt = require('jsonwebtoken');

// TODO: split this module up into multiple controllers

var splitSign = '|';
//need to add authentification options
var getMultiple = function(req, res, repr, name) {
	var params = req.query;
	if(typeof name === 'string') {
		DBManager.get(params, repr, function(results) {
			var result={};
			result[name]= results;
			res.json(result);
		});
	}
	else {
		DBManager.get(params, repr, name);
	}

};
//need to add authentification options
var getSingle = function(req, res, repr, fct) {
	if(fct === undefined) {
		fct = function(results) {
			if(results[0] === undefined) {
				res.status(404).end();
			}
			else {
				res.json(results[0]);
			}
		};
	}
	DBManager.get({id: req.params.id}, repr, fct);
};
//need to add authentification options
var postSingle = function(req, res, repr) {
	DBManager.post(req.body, repr, function(id) {
		res.status(201).json({id: id});
	});
};
//need to add authentification options
var putSingle = function(req, res, repr) {
	DBManager.put(req.body, repr, function(id) {
		res.status(200).end();
	});
};

var deleteSingle = function(req, res, repr) {
	DBManager.delete({id: req.params.id}, repr, function() {
		res.sendStatus(200);
	});
};

var splitInArray = function(param) {
	var array = param.split(splitSign);
	for(var i in array) {
		array[i] = {id:array[i]};
	}
	return array;
};

module.exports = {

	getDisciplines: function(req, res) {
		if(req.query.journals !== undefined) {
			req.query.journals = splitInArray(req.query.journals);
		}
		if(req.query.proceedings !== undefined) {
			req.query.proceedings = splitInArray(req.query.proceedings);
		}
		getMultiple(req, res, linker.disciplineRepr, 'disciplines');
	},

	getDiscipline : function(req, res) {
		getSingle(req, res, linker.disciplineRepr);
	},

	getJournals :function(req, res) {
		if(req.query.disciplines !== undefined) {
			req.query.disciplines = splitInArray(req.query.disciplines);
		}
		getMultiple(req, res, linker.journalRepr, 'journals');
	},

	getJournal: function(req, res) {
		getSingle(req, res, linker.journalRepr);
	},

	getJournalDisciplines: function(req, res) {
		req.query.journals = [{id:req.params.id}];
		if(req.query.proceedings !== undefined) {
			req.query.proceedings = splitInArray(req.query.proceedings);
		}
		getMultiple(req, res, linker.disciplineRepr, 'disciplines');
	},

	getProceedings: function(req, res) {
		if(req.query.disciplines !== undefined) {
			req.query.disciplines = splitInArray(req.query.disciplines);
		}
		getMultiple(req, res, linker.proceedingRepr, 'proceedings');
	},

	getProceeding: function(req, res) {
		getSingle(req, res, linker.proceedingRepr);
	},

	getProceedingDisciplines :function(req, res) {
		req.query.proceedings = [{id:req.params.id}];
		if(req.query.journals !== undefined) {
			req.query.journals = splitInArray(req.query.journals);
		}
		getMultiple(req, res, linker.disciplineRepr, 'disciplines');
	},

	getAffiliations: function(req, res) {
		getMultiple(req, res, linker.affiliationRepr, 'affiliations');
	},

	getAffiliation: function(req, res) {
		getSingle(req, res, linker.affiliationRepr);
	},

	postAffiliation: function(req, res) {
		postSingle(req, res, linker.affiliationRepr);
	},

	getPersons: function(req, res) {
		if(req.query.publications !== undefined) {
			req.query.publications = splitInArray(req.query.publications);
		}
		getMultiple(req, res, linker.personRepr, 'persons');
	},

	getPerson: function(req, res) {
		getSingle(req, res, linker.personRepr);
	},

	getPersonPublications: function(req, res) {
		req.query.authors = [{id:req.params.id}];
		getMultiple(req, res, linker.publicationRepr, 'publications');
	},

	postPerson: function(req, res) {
		postSingle(req, res, linker.personRepr);
	},

	putPerson: function(req, res) {
		putSingle(req, res, linker.personRepr);
	},

	getUser: function(req, res) {
		getSingle(req, res, linker.userRepr);
	},

	postUser: function(req, res) {
		if(req.body.profileImageSrc) {
			req.body.picture = imageSaver(req.body.profileImageSrc);
		}
		postSingle(req, res, linker.userRepr);
	},

	putUser: function(req, res) {
		putSingle(req, res, linker.userRepr);
	},

	getUserLibrary: function(req, res) {
		getMultiple(req, res, linker.userRepr, 'publications');
	},

	getPublications :function(req, res) {
		if(req.query.authors !== undefined) {
			req.query.authors = splitInArray(req.query.authors);
		}
		getMultiple(req, res, linker.journalPublicationRepr, function(jp) {
			getMultiple(req, res, linker.proceedingPublicationRepr, function(pp) {
				var result={};
				result.publications= jp.concat(pp);
				res.json(result);
			});
		});
	},

	getPublication: function(req, res) {
		getSingle(req, res, linker.journalPublicationRepr, function(jp) {
			if(jp[0] === undefined) {
				getSingle(req, res, linker.proceedingPublicationRepr);
			}
			else {
				res.json(jp[0]);
			}
		});
	},
	deletePublication: function(req, res) {
		deleteSingle(req, res, linker.publicationRepr);
	},

	postPublication :function(req, res) {
		res.status(501).end();
	},

	getPublicationAuthors: function(req, res) {
		req.query.publications = [{id:req.params.id}];
		getMultiple(req, res, linker.personRepr, 'persons');
	},
	login: function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		if(email === '' || password === '') {
			res.sendStatus(401);
		}
		var onSuccess = function(users) {
			if(users.length === 1) {
				var token = jwt.sign(users[0], config.secretToken, { expiresInMinutes: 60 });
				res.json({token: token});
			} else {
				res.status(401).json({error: 'Wrong email or password'});
			}

		};
		DBManager.get({email: email, password: password}, linker.userRepr, onSuccess);
	},

	postUploadFile: function(req,res){
		var WrongType = function(){
			res.status(400).send('Not a pdf or bibtex');
		};

		var OnEnd= function(data){
			res.json(data);
		};

		filehandler.handleFile(req,WrongType,OnEnd);
	}
};
