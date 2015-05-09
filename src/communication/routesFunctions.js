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
var core = require('../core/exports.js');

//For login
var jwt = require('jsonwebtoken');


/**
 * Send an error back to the client based on error information or error 500 otherwise
 * @param  {Object} res   result Object from Express
 * @param  {Object} error Error to send to user
 */
var reportError = function(res, error) {
	res.status(error.status ? error.status : 500).json({text: error.statusText ? error.statusText : 'A server error occurred'});
};
/**
 * sign used to split Arrays in the splitInArray function
 * @type {String}
 */
var splitSign = '|';
/**
 * Splits param into an array and assign object with id to each element in array
 * @param  {String} param String to split
 * @return {Array}       Modified array
 */
var splitInArray = function(param) {
	var array = param.split(splitSign);
	for(var i in array) {
		array[i] = {id:array[i]};
	}
	return array;
};

/**
 * Splits each name string in query and reassigns it in the query
 * @param  {Object} query Holds names keys and values
 * @param  {Array} names Keys in query for which to split the string
 * @return {Object}       Modified query
 */
var processQueryArrays = function(query, names) {
	names.forEach(function(name) {
		if(query[name] !== undefined) {
			query[name] = splitInArray(query[name]);
		}
	});
	return query;
};

/**
 * Returns the instance of the CoreClass with the id given in the query, if the instance should have a rank, it is calculated here.
 * @param  {Object} req       	HTTP request, contains query 
 * @param  {Object} res       	HTTP response, the object to which the result is send
 * @param  {Object} CoreClass 	The type of core object we are requesting
 * @return {Void}           	No return value
 */
var getSingle = function(req, res, CoreClass) {
	new CoreClass(req.params.id).fetch()
	.then(function(instance) {
		if(instance instanceof core.Rankable) {
			return instance.calculateRank();
		}
		else {
			return instance;
		}
	})
	.then(function(instance) {
		res.json(instance);
	})
	.catch(function(error) {
		reportError(res, error);
	});
};

/**
 * Returns 1 or more instances of the CoreClass satisfying the parameters from the query. Instances willl be filled with data coming from the database
 * @param  {Object} req       	HTTP request, contains query 
 * @param  {Object} res       	HTTP response, the object to which the result is send
 * @param  {Object} CoreClass 	The type of core object we are requesting
 * @param  {Object} name      	The name of the array, containing the results, will have in the response.
 * @return {void}           	No return value
 */
var getMultiple = function(req, res, CoreClass, name) {
	var params = req.query;
	new CoreClass(params).fetchAll()
	.then(function(instances) {
		var result = {};
		result[name] = instances;
		res.json(result);
	})
	.catch(function(error) {
		reportError(res, error);
	});
};

/**
 * Post a new core object to the database with the data provide from the body of the request
 * @param  {Object} req       	HTTP request, contains body with data 
 * @param  {Object} res       	HTTP response, expects the id of the newly created object
 * @param  {Object} CoreClass 	The type of core object we are creating
 * @return {void}           	No return value
 */
var postSingle = function(req, res, CoreClass) {
	new CoreClass(req.body).save()
	.then(function(instance) {
		res.status(201).json({id: instance.id});
	})
	.catch(function(error) {
		reportError(res, error);
	});
};

/**
 * Edit a core object int the database with the data provide from the body of the request
 * @param  {Object} req       	HTTP request, contains body with data (data should have an id field)
 * @param  {Object} res       	HTTP response, expects the id of changed object
 * @param  {Object} CoreClass 	The type of core object we are creating
 * @return {void}           	No return value
 */
var putSingle = function(req, res, CoreClass) {
	new CoreClass(req.body).save()
	.then(function(instance) {
		res.status(200).json({id: instance.id});
	})
	.catch(function(error) {
		reportError(res, error);
	});
};

module.exports = {

	/**
	 * Answers a HTTP request with all disciplines satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getDisciplines: function(req, res) {
		processQueryArrays(req.query, ['journals', 'proceedings']);
		getMultiple(req, res, core.Discipline, 'disciplines');
	},

	/**
	 * Answers a HTTP request with the discipline with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getDiscipline: function(req, res) {
		getSingle(req, res, core.Discipline);
	},

	/**
	 * Answers a HTTP request with all Journals satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getJournals: function(req, res) {
		processQueryArrays(req.query, ['disciplines']);
		getMultiple(req, res, core.Journal, 'journals');
	},

	/**
	 * Answers a HTTP request with the journal with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getJournal: function(req, res) {
		getSingle(req, res, core.Journal);
	},

	/**
	 * Answers a HTTP request with all disciplines of the journal with a given id 
	 * @param  {Object} req HTTP request containing parameters (should only contain id)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getJournalDisciplines: function(req, res) {
		req.query.journals = [{id:req.params.id}];
		processQueryArrays(req.query, ['proceedings']);
		getMultiple(req, res, core.Discipline, 'disciplines');
	},

	/**
	 * Answers a HTTP request with all proceedings satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getProceedings: function(req, res) {
		processQueryArrays(req.query, ['disciplines']);
		getMultiple(req, res, core.Proceeding, 'proceedings');
	},

	/**
	 * Answers a HTTP request with the proceeding with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getProceeding: function(req, res) {
		getSingle(req, res, core.Proceeding);
	},

	/**
	 * Answers a HTTP request with all disciplines of the proceeding with a given id 
	 * @param  {Object} req HTTP request containing parameters (should only contain id)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getProceedingDisciplines: function(req, res) {
		req.query.proceedings = [{id:req.params.id}];
		processQueryArrays(req.query, ['journals']);
		getMultiple(req, res, core.Discipline, 'disciplines');
	},

	/**
	 * Answers a HTTP request with all affiliations satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getAffiliations: function(req, res) {
		getMultiple(req, res, core.Affiliation, 'affiliations');
	},

	/**
	 * Answers a HTTP request with the affiliation with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getAffiliation: function(req, res) {
		getSingle(req, res, core.Affiliation);
	},

	/**
	 * Creates a new affiliation object with given data, and adds a new Affiliation to the database
	 * @param  {Object} req HTTP request containing body with data
	 * @param  {Object} res HTTP response expects the id of the newly created affiliation
	 * @return {void}   No return value
	 */
	postAffiliation: function(req, res) {
		postSingle(req, res, core.Affiliation);
	},

	/**
	 * Answers a HTTP request with all persons satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPersons: function(req, res) {
		if(req.query.publications !== undefined) {
			req.query.publications = splitInArray(req.query.publications);
		}
		getMultiple(req, res, core.Person, 'persons');
	},

	/**
	 * Answers a HTTP request with the person with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPerson: function(req, res) {
		getSingle(req, res, core.Person, undefined, true);
	},

	/**
	 * Answers a HTTP request with all publications of the person with the given id
	 * @param  {Object} req HTTP request containing parameters (should only contain id)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPersonPublications: function(req, res) {
		req.query.authors = [{id:req.params.id}];
		getMultiple(req, res, core.Publication, 'publications');
	},

	/**
	 * Answers a HTTP request with all persons that are contacts of the person with the given id
	 * @param  {Object} req HTTP request containing parameters (should only contain id)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPersonContacts: function(req, res) {
		new core.Person(req.params.id).getContacts()
		.then(function(persons) {
			res.json({persons: persons});
		})
		.catch(function(error) {
			reportError(res, error);
		});
	},

	/**
	 * Creates a new person object with given data, and adds a new person to the database
	 * @param  {Object} req HTTP request containing body with data
	 * @param  {Object} res HTTP response the id of the newly created person
	 * @return {void}   No return value
	 */
	postPerson: function(req, res) {
		postSingle(req, res, core.Person);
	},

	/**
	 * Creates a new person object with given data, and edits the person in the database with the given id and new data
	 * @param  {Object} req HTTP request containing body with data (should contain id)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	putPerson: function(req, res) {
		putSingle(req, res, core.Person);
	},

	/**
	 * Answers a HTTP request with the user with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getUser: function(req, res) {
		getSingle(req, res, core.User);
	},

	/**
	 * Creates a new user object with given data, and adds a new user to the database
	 * @param  {Object} req HTTP request containing body with data
	 * @param  {Object} res HTTP response the id of the newly created user
	 * @return {void}   No return value
	 */
	postUser: function(req, res) {
		if(req.body.profileImageSrc) {
			req.body.picture = new core.Formatter(req.body.profileImageSrc).format();
		}
		postSingle(req, res, core.User);
	},

	/**
	 * Creates a new user object with given data, and edits the user in the database with the given id and new data
	 * @param  {Object} req HTTP request containing body with data (should contain id)
	 * @param  {Object} res HTTP response expects a json web token
	 * @return {void}   No return value
	 */
	putUser: function(req, res) {
		new core.User(req.body).save()
		.then(function(instance) {
			return new core.User(instance.id).fetch();
		})
		.then(function(instance) {
			var token = jwt.sign(instance, config.secretToken, { expiresInMinutes: 60 });
			res.status(200).json({token: token});
		});
	},

	/**
	 * Answers a HTTP request with the publication in the personal library of the user, with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getUserLibrary: function(req, res) {
		new core.User(req.params.id).fetch()
		.then(function(instance) {
			return Promise.all(instance.library.map(function(pub) {
				return new core.Publication(pub).fetch();
			}));
		})
		.then(function(instances) {
			var result = {};
			result.publications = instances;
			res.json(result);
		})
		.catch(function(error) {
			reportError(res, error);
		});
	},

	/**
	 * Answers a HTTP request with all (unknown) publications satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getUnknownPublications :function(req, res) {
		getMultiple(req, res, core.UnknownPublication, 'publications');
	},

	
	postUnknownPublications: function(req, res){
		postSingle(req, res, core.UnknownPublication);
	},

	/**
	 * Answers a HTTP request with all publications satisfying the request parameters 
	 * @param  {Object} req HTTP request containing parameters
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPublications :function(req, res) {
		processQueryArrays(req.query, ['authors']);
		var params = req.query;
		var jp = new core.JournalPublication(params).fetchAll();
		var pp = [];//new core.ProceedingPublication(params).fetchAll();
		Promise.all([jp, pp])
		.then(function(p) {
			var result = {};
			result.publications = p[0].concat(p[1]);
			res.json(result);
		})
		.catch(function(error) {
			reportError(res, error);
		});
	},

	/**
	 * Answers a HTTP request with the publication with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPublication: function(req, res) { 
		new core.Publication(req.params.id).fetch()
		.then(function(instance) { 
			if(instance == undefined){
				throw new Error("not found");
			}
			else if(instance.type === 'Journal') {
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
		})
		.catch(function(error) {console.log(error)
			reportError(res, error);
		});
	},

	/**
	 * Deletes a publication object, with the id of the parameters, in the database.
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	deletePublication: function(req, res) {
		new core.JournalPublication(req.params.id).fetch()
		.catch(function() {
			return new core.ProceedingPublication(req.params.id).fetch();
		})
		.then(function(instance) {
			return instance.destroy();
		})
		.then(function() {
			res.status(200).end();
		})
		.catch(function(error) {
			reportError(res, error);
		});
	},

	/**
	 * Creates a new publication object with given data, and adds a new publication to the database
	 * @param  {Object} req HTTP request containing body with data
	 * @param  {Object} res HTTP response expects id of newly added publication
	 * @return {void}   No return value
	 */
	postPublication: function(req, res) {
		if (req.body.type === 'Journal') postSingle(req, res, core.JournalPublication);
		else if(req.body.type === 'Proceeding') postSingle(req, res, core.ProceedingPublication);
		else req.status(401).json({text: 'Wrong type' + req.body.type});
	},

	/**
	 * Answers a HTTP request with the persons that are authors of the publication, with the id in the parameters
	 * @param  {Object} req HTTP request containing parameters (only id is used)
	 * @param  {Object} res HTTP response
	 * @return {void}   No return value
	 */
	getPublicationAuthors: function(req, res) {
		req.query.publications = [{id:req.params.id}];
		getMultiple(req, res, core.Person, 'persons');
	},

	/**
	 * Checks login info, given in the request and returns jwon web token when info is correct
	 * @param  {Object} req HTTP request containing login info
	 * @param  {Object} res HTTP response expects json web token on correct info
	 * @return {void}    	No return value
	 */
	login: function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		if(email === '' || password === '') {
			res.status(401).json({text: 'Email or password not provided.'});
		}
		new core.User({email: email, password: password}).fetchAll()
		.then(function(users) {
			if(users.length === 1) {
				var token = jwt.sign(users[0], config.secretToken, { expiresInMinutes: 60 });
				res.json({token: token});
			} else {
				res.status(401).json({text: 'Wrong email or password'});
			}
		})
		.catch(function(error) {
			reportError(res, error);
		});
	},

	/**
	 * Handles the upload of both pdfs and BIBTEX files. Files get parsed as they are uploaded. Relevant information from the files is returned to the uploader
	 * @param  {Object} req HTTP request containg file
	 * @param  {Object} res HTTP response expects ectracted data 
	 * @return {void}     	No return value
	 */
	postUploadFile: function(req,res){
		var file = req.files.file;
		if(core.PDFParser.prototype.isSupported(file.mimetype)) {
			new core.PDFParser(file).extract()
			.then(function(data) {
				res.json(data);
			})
			.catch(function(error) {
				reportError(res, error);
			});
		}
		else if (core.BibtexParser.prototype.isSupported(file.mimetype)) {
			new core.BibtexParser(file).extract()
			.then(function(data) {
				res.json(data);
			})
			.catch(function(error) {
				reportError(res, error);
			});
		}
		else {
			res.status(400).send('Not a pdf or bibtex');
		}
	}
};
