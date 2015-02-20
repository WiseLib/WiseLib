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
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var _ = require('lodash');
var routes = require('./routes');

// the HTTP methods that are supported
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

    // serve static Angular files
    console.log('path: ' + path.resolve('public/'));
    app.use(express.static(path.resolve('public/')));

    // register all controllers
    routes(app);
};
