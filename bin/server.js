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

// log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var c = new Client();
c.connect({
    host: 'wilma.vub.ac.be',
    user: 'se2_1415',
    password: 'Bacci98Goft',
    db: 'se2_1415'
});


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

	c.query(query.toString())
		.on('result', function (res) {
			res.on('row', function (row) {
				console.log('Result row: ' + JSON.stringify(row));
				response.json(row);
			})
		.on('error', function (err) {
				console.log('Result error: ' + err);
			})
		.on('end', function (info) {
				console.log('Result finished successfully');
			});
		})
		.on('end', function () {
			console.log('Done with all results');
		});
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve('../../Client/src/app/register.html')); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);
console.log('Listening on port 8080');