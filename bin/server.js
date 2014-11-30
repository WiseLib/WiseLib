#!/usr/bin/env node

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */
'use strict';

 // set up ========================
var express  = require('express');
var path = require('path');
var app      = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var dbscheme = require('./db.js');
var Client = require('mariasql');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./wiselib.json'));

// log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


var c = new Client();
c.connect(config.database);

//For validation: should we use... another module? :D like http://blog.ijasoneverett.com/2013/04/form-validation-in-node-js-with-express-validator/
//Validation for other fields not written yet
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


app.use(express.static(path.resolve('../../Client/src/app/')));
app.get('/api/test', function (req, res) {
	res.send('boo');
});


//Get all users
app.get('/api/user/:user_id', function (req, res) {
	//var id = req.params.user_id;
	res.send('boo');
});

app.post('/api/person/search', function (req, response) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var query = dbscheme.person.select(dbscheme.person.star())
				.from(dbscheme.person)
				.where(
					dbscheme.person.first_name.like('%' + firstName + '%')
					.and(dbscheme.person.last_name.like('%' + lastName + '%')));

	var result = []
	c.query(query.toString())
		.on('result', function (res) {
			res.on('row', function (row) {
				//console.log('Result row: ' + JSON.stringify(row));
				result.push(row)
			})
		.on('error', function (err) {
				console.log('Result error: ' + err);
			})
		.on('end', function (info) {
				console.log('Result finished successfully: ' + JSON.stringify(info));
				response.send(result);
			});
		})
		.on('end', function () {
			console.log('Done with all results');
		});
});


app.post('/api/person', function (req, response) {
	console.log('Received request');

	if (!validateEmail(req.body.email)) {
		console.log('invalid email');
		response.status(500);
		response.send(new Error('Email not valid'));
		return;
	}



	if(req.body.personId) {
		console.log('We have a person id');
		var query = dbscheme.user.insert(
										dbscheme.user.email_address.value(req.body.email),
										dbscheme.user.person_id.value(req.body.personId), 
										dbscheme.user.password.value(req.body.password),
										dbscheme.user.part_of_affiliation_id.value('VUB'));
		c.query(query.toString())
		.on('result', function (res) {
			res.on('row', function (row) {
				console.log('Result row: ' + JSON.stringify(row));
			})
		.on('error', function (err) {
				response.send(err);
			})
		.on('end', function (info) {
				console.log('succes info: ' + JSON.stringify(info));
				response.send('Result finished successfully');
			});
		})
		.on('end', function () {
			console.log('Done with all results');
		});
	} else {
		console.log('no person id');
		var firstQuery = dbscheme.person.insert(
										dbscheme.person.first_name.value(req.body.firstName),
										dbscheme.person.last_name.value(req.body.lastName));
		c.query(firstQuery.toString())
		.on('result', function (res) {
			res.on('row', function (row) {
				console.log('Result row: ' + JSON.stringify(row));
			})
		.on('error', function (err) {
				response.send(err);
			})
		.on('end', function (info) {
				var query = dbscheme.user.insert(
										dbscheme.user.email_address.value(req.body.email), 
										dbscheme.user.person_id.value(info.insertId), 
										dbscheme.user.password.value(req.body.password),
										dbscheme.user.part_of_affiliation_id.value('VUB'));
				c.query(query.toString())
				.on('result', function (res) {
					res.on('row', function (row) {
						console.log('Result row: ' + JSON.stringify(row));
					})
				.on('error', function (err) {
						response.send(err);
					})
				.on('end', function (info) {
						console.log('succes info: ' + JSON.stringify(info));
						response.send('Result finished successfully');
					});
				})
				.on('end', function () {
					console.log('Done with all results');
				});
					});
				})
				.on('end', function () {
					console.log('Done with all results');
				});


	}
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve('../../Client/src/app/register.html')); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);
console.log('Listening on port 8080');