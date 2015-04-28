'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 //var validator = require('./validator.js'); //Not used yet
 var Promise = require('bluebird');
 var config = require('../config.js');
 var imageSaver = require('../imagesaver.js');
 var filehandler = require('../filehandler.js');
 var core = require('../core/exports.js');

 //For login
 var jwt = require('jsonwebtoken');

// TODO: split this module up into multiple controllers

var splitSign = '|';
//need to add authentification options
var getMultiple = function(req, res, coreClass, name) {
	var params = req.query;
	coreClass.prototype.fetchAll(new coreClass(params))
	.then(function(instances) {
		var result={};
		result[name]= instances;
		res.json(result);
	});

};
//need to add authentification options
var getSingle = function(req, res, coreClass) {
	new coreClass(req.params.id).fetch()
	.then(function(instance) {
		if(instance instanceof core.RankAble) {
			return instance.calculateRank();
		}
		else {
			return instance;
		}
	})
	.then(function(instance) {
		res.json(instance);
	})
	.catch(function(id) {
		console.log(id);
	});
};
//need to add authentification options
var postSingle = function(req, res, coreClass) {
	new coreClass(req.body).save()
	.then(function(instance) {
		res.status(201).json({id: instance.id});
	});
};
//need to add authentification options
var putSingle = function(req, res, coreClass) {
	new coreClass(req.body).save()
	.then(function(instance) {
		res.status(200).json({id: instance.id});
	});
};

var deleteSingle = function(req, res, coreClass) {
	new coreClass(req.params.id).destroy()
	.then(function(instance) {
		res.status(200).end();
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
		getMultiple(req, res, core.Discipline, 'disciplines');
	},

	getDiscipline : function(req, res) {
		getSingle(req, res, core.Discipline);
	},

	getJournals :function(req, res) {
		if(req.query.disciplines !== undefined) {
			req.query.disciplines = splitInArray(req.query.disciplines);
		}
		getMultiple(req, res, core.Journal, 'journals');
	},

	getJournal: function(req, res) {
		getSingle(req, res, core.Journal);
	},

	getJournalDisciplines: function(req, res) {
		req.query.journals = [{id:req.params.id}];
		if(req.query.proceedings !== undefined) {
			req.query.proceedings = splitInArray(req.query.proceedings);
		}
		getMultiple(req, res, core.Discipline, 'disciplines');
	},

	getProceedings: function(req, res) {
		if(req.query.disciplines !== undefined) {
			req.query.disciplines = splitInArray(req.query.disciplines);
		}
		getMultiple(req, res, core.Proceeding, 'proceedings');
	},

	getProceeding: function(req, res) {
		getSingle(req, res, core.Proceeding);
	},

	getProceedingDisciplines :function(req, res) {
		req.query.proceedings = [{id:req.params.id}];
		if(req.query.journals !== undefined) {
			req.query.journals = splitInArray(req.query.journals);
		}
		getMultiple(req, res, core.Discipline, 'disciplines');
	},

	getAffiliations: function(req, res) {
		getMultiple(req, res, core.Affiliation, 'affiliations');
	},

	getAffiliation: function(req, res) {
		getSingle(req, res, core.Affiliation);
	},

	postAffiliation: function(req, res) {
		postSingle(req, res, core.Affiliation);
	},

	getPersons: function(req, res) {
		if(req.query.publications !== undefined) {
			req.query.publications = splitInArray(req.query.publications);
		}
		getMultiple(req, res, core.Person, 'persons');
	},

	getPerson: function(req, res) {
		getSingle(req, res, core.Person, undefined, true);
	},

	getPersonPublications: function(req, res) {
		req.query.authors = [{id:req.params.id}];
		getMultiple(req, res, core.Publication, 'publications');
	},

	postPerson: function(req, res) {
		postSingle(req, res, core.Person);
	},

	putPerson: function(req, res) {
		putSingle(req, res, core.Person);
	},

	getUser: function(req, res) {
		getSingle(req, res, core.User);
	},

	postUser: function(req, res) {
		if(req.body.profileImageSrc) {
			req.body.picture = imageSaver(req.body.profileImageSrc);
		}
		postSingle(req, res, core.User);
	},

	putUser: function(req, res) {
		putSingle(req, res, core.User);
	},

	getPublications :function(req, res) {
		if(req.query.authors !== undefined) {
			req.query.authors = splitInArray(req.query.authors);
		}
		var params = req.query;
		var jp = core.JournalPublication.prototype.fetchAll(new core.JournalPublication(params));
		var pp = core.ProceedingPublication.prototype.fetchAll(new core.ProceedingPublication(params));
		jp.catch(function(t){console.log(t)});
		Promise.all([jp, pp])
		.then(function(p) {
			var result={};
			result.publications= p[0].concat(p[1]);
			res.json(result);
		});
	},

	getPublication: function(req, res) {
		new core.Publication(req.params.id).fetch()
		.then(function(instance) {
			if(instance.type === 'Journal') {
				return new core.JournalPublication(req.params.id).fetch();
			}
			else if(instance.type === 'Proceeding') {
				return new core.ProceedingPublication(req.params.id).fetch();
			}
			else {
				return instance;
			}
		})
		.then(function(instance) {
			return instance.calculateRank();
		})
		.then(function(instance) {
			res.json(instance);
		});
	},
	deletePublication: function(req, res) {
		new core.JournalPublication(req.params.id).fetch()
		.catch(function(id) {
			return new core.ProceedingPublication(req.params.id).fetch();
		})
		.then(function(instance) {
			return instance.destroy();
		})
		.then(function(instance) {
			res.status(200).end();
		});
	},

	postPublication: function(req, res) {
		if (req.body.type === 'Journal') postSingle(req, res, core.JournalPublication);
		else if(req.body.type === 'Proceeding') postSingle(req, res, core.ProceedingPublication);
		else req.status(401).json({error:'Wrong type' + req.body.type});
	},

	getPublicationAuthors: function(req, res) {
		req.query.publications = [{id:req.params.id}];
		getMultiple(req, res, core.Person, 'persons');
	},
	login: function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		if(email === '' || password === '') {
			res.sendStatus(401);
		}
		core.User.prototype.fetchAll(new core.User({email: email, password: password}))
		.then(function(users) {
			if(users.length === 1) {
				var token = jwt.sign(users[0], config.secretToken, { expiresInMinutes: 60 });
				res.json({token: token});
			} else {
				res.status(401).json({error: 'Wrong email or password'});
			}
		});
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
