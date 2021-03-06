'use strict';

/*
 * server
 * https://github.com/WiseLib/WiseLib
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

var express = require('express');
var multer  = require('multer');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var routes = require('./communication/routes.js');

module.exports = function(app) {
    // log every request to the console
    app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    app.use(multer({ dest: './uploads/'}));

    app.use(bodyParser.json({limit: '50mb'}));

    // serve static Angular files
    app.use(express.static(__dirname + '/../public/'));
    app.use('/img/pi', express.static(__dirname + '/../img/pi'));
    app.use('/uploads', express.static(__dirname + '/../uploads'));

    // register all controllers
    routes(app);
};
