#!/usr/bin/env node
'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 // set up ========================
var express  = require('express');
var path = require('path');
var util = require('util');
var app      = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var dbscheme = require('./db.js');
var Client = require('mariasql');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname + '/wiselib.json'));
var DBManager = require('./dbmanager.js');
var _ = require('lodash');
var _routes = _(require('./routes'));

var dbm = new DBManager(config.database);


var _methods = _(['get', 'post', 'put', 'patch', 'delete']);
  //ERROR : bodyParser is now an external module, need to be added
//app.use(express.bodyParser());

var errorPage = function (req, res) {
    res.send('method not supported');
};
module.exports = function (app) {

	// log every request to the console
    app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

	console.log('path: ' + path.resolve('../public/'));
    app.use(express.static(path.resolve('../public/')));
  // register all controllers
    _routes.forEach(function (operations, path) {
        console.log('route', path);
        _methods.forEach(function (method) {
            if (operations[method]) {
                console.log('  - %s', method.toUpperCase());
            }
            app[method](path + '.json', operations[method] || errorPage);
        });
    });

//For validation: should we use... another module? :D like http://blog.ijasoneverett.com/2013/04/form-validation-in-node-js-with-express-validator/
//Validation for other fields not written yet
/**
 * Checks if <tt>email</tt> is a valid email address.
 * @param  {string} email
 * @return {boolean}
 */
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }



    app.get('/api/test', function (req, res) {
        res.send('boo');
    });


//Get all users
    app.get('/api/user/:user_id', function (req, res) {
        //var id = req.params.user_id;
        res.send('boo');
    });
/**
 * Handles a request from a client to search for a person
 * @param  {object} req
 * @param  {object} response
 * @return {None}
 */
    var searchPerson = function (req, response) {
        var onSuccess = function (res) {
            response.send(res);
        };
        console.log('getPerson reqbody: ' + JSON.stringify(req.body));
        dbm.getPerson(req.body, onSuccess);
    };

    app.post('/api/person/search.json', searchPerson);
/**
 * Handles a request from a client to register a person
 * @param  {object} req
 * @param  {object} response
 * @return {None}
 */
    var registerUser = function (req, response) {
        console.log('Received request');
        //Other validations need to be added
        if (!validateEmail(req.body.email)) {
            response.status(500).send('Invalid email address. Please try again');
            return;
    }

        if (req.body.personId) {
            console.log('We have a person id');
            var query = dbscheme.user.insert(
                                            dbscheme.user.email_address.value(req.body.email),
                                            dbscheme.user.person_id.value(req.body.personId),
                                            dbscheme.user.password.value(req.body.password),
                                            dbscheme.user.part_of_affiliation_id.value(0)).toQuery();
            c.query(query.text, query.values)
                .on('result', function (res) {
                    res.on('row', function (row) {
                        console.log('Result row: ' + JSON.stringify(row));
                    })
                .on('error', function (err) {
                        response.status(500).send(err);
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
            var insertPersonQuery = dbscheme.person.insert(
                                            dbscheme.person.first_name.value(req.body.firstName),
                                            dbscheme.person.last_name.value(req.body.lastName)).toQuery();
            c.query(insertPersonQuery.text, insertPersonQuery.values)
               .on('result', function (res) {
                res.on('row', function (row) {
                    console.log('Result row: ' + JSON.stringify(row));
                })
                .on('error', function (err) {
                        response.status(500).send(err);
                    })
                .on('end', function (info) {
                        var insertUserQuery = dbscheme.user.insert(
                                                dbscheme.user.email_address.value(req.body.email),
                                                dbscheme.user.person_id.value(info.insertId),
                                                dbscheme.user.password.value(req.body.password),
                                                dbscheme.user.part_of_affiliation_id.value('VUB')).toQuery();
                        c.query(insertUserQuery.text, insertUserQuery.values)
                            .on('result', function (res) {
                                res.on('row', function (row) {
                                    console.log('Result row: ' + JSON.stringify(row));
                                })
                            .on('error', function (err) {
                                    response.status(500).send(err);
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
    };
    app.post('/api/person', registerUser);
    /**
     * Handles a request from a client to get any non-static resource
     * @param  {object} req
     * @param  {object} res
     * @return {None}
     */
    var getStartPage = function (req, res) {
        res.sendFile(req.path, {root: __dirname + '/../public/'}); // load the single view file (angular will handle the page changes on the front-end)
    };
    app.get('*', getStartPage);
};