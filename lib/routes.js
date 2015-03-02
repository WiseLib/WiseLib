'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 var validator = require('./validator.js');
 var JSONManager = require('./jsonmanager.js');
 var DBManager = require('./dbmanager.js');
 var Discipline = require('./discipline.js');
 var Journal = require('./journal.js');
 var config = require('./config.js');
 var linker = require('./linker.js');
 var imageSaver = require('./imagesaver.js');
 var filehandler = require('./filehandler.js');

 var routeFunctions = require('./routesFunctions.js');

//For login
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');

var dbManager = new DBManager(config.database);
var auth = ejwt({secret: config.secretToken});


module.exports = function(app) {

    app.route('/disciplines.json')
    .get(routeFunctions.getDisciplines);

    app.route('/journals.json')
    .get(routeFunctions.getJournals);

    app.route('/proceedings.json')
    .get(routeFunctions.getProceedings);

    app.route('/journals/:id.json')
    .get(routeFunctions.getJournalById);

    app.route('/persons.json')
    .get(routeFunctions.getPersons);

    app.route('/user.json')
    .post(routeFunctions.postUser);


    app.route('/users/:id/publications.json')
    .get(routeFunctions.getPublicationById)
    .post(auth, routeFunctions.postPublicationById);

    app.route('/users/login.json')
    .post(routeFunctions.postUserLogin);

    app.route('/uploadfile')
    .post(routeFunctions.postUploadFile);

    app.route('*')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });
};
