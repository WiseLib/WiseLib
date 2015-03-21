'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 var validator = require('./validator.js');
 var DBManager = require('./dbmanager.js');
 var config = require('./config.js');
 var linker = require('./linker.js');
 var imageSaver = require('./imagesaver.js');
 var filehandler = require('./filehandler.js');

 //For login
 var jwt = require('jsonwebtoken');

// TODO: split this module up into multiple controllers


//need to add authentification options
var getMultiple = function(req, res, repr, name) {
	var params = req.query;
	DBManager.get(params, repr, function(results) {
		var result={};
		result[name]= results;
		res.json(result);
	});
};
//need to add authentification options
var getSingle = function(req, res, repr) {
	DBManager.get({id: req.params.id}, repr, function(results) {
		if(results[0] === undefined) {
			res.status(404).end();
		}
		else {
			res.json(results[0]);
		}
	});
};
//need to add authentification options
var postSingle = function(req, res, repr) {
	DBManager.post(req.body, repr, function(id) {
		res.status(200).end();
	});
};
//need to add authentification options
var putSingle = function(req, res, repr) {
	DBManager.put(req.body, repr, function(id) {console.log(req.body);
		res.status(200).end();
	});
};

module.exports = {

	getDisciplines: function(req, res) {
		getMultiple(req, res, linker.disciplineRepr, 'disciplines');
	},

	getDiscipline : function(req, res) {
		getSingle(req, res, linker.disciplineRepr);
	},

	getJournals :function(req, res) {
		getMultiple(req, res, linker.journalRepr, 'journals');
	},

	getJournal: function(req, res) {
		getSingle(req, res, linker.journalRepr);
	},

	getJournalDisciplines: function(req, res) {
		req.query.journal = req.params.id;
		getMultiple(req, res, linker.disciplineRepr, 'disciplines');
	},

	getProceedings: function(req, res) {
		getMultiple(req, res, linker.proceedingRepr, 'proceedings');
	},

	getProceeding: function(req, res) {
		getSingle(req, res, linker.proceedingRepr);
	},

	getProceedingDisciplines :function(req, res) {
		req.query.proceeding = req.params.id;
		getMultiple(req, res, linker.disciplineRepr, 'disciplines');
	},

	getPersons: function(req, res) {
		getMultiple(req, res, linker.personRepr, 'persons');
	},

	getPerson :function(req, res) {
		getSingle(req, res, linker.personRepr);
	},

	getPersonPublications: function(req, res) {console.log(req.body);
		req.query.authors = [req.params.id];
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

	getPublications :function(req, res) {
		getMultiple(req, res, linker.publicationRepr, 'publications');
	},

	getPublication: function(req, res) {
		getSingle(req, res, linker.publicationRepr);
	},

	postPublication :function(req, res) {
		res.status(501).end();
	},

	getPublicationAuthors: function(req, res) {
		req.query.publications = [req.params.id];
		getMultiple(req, res, linker.personRepr, 'persons');
	},
	login: function(req, res) {
		res.status(501).end();
	},

	postUserLogin: function(req, res) {
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