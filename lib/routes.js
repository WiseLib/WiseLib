'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 var validator = require('./validator.js');;
 var config = require('./config.js');
 var linker = require('./linker.js');
 var imageSaver = require('./imagesaver.js');
 var filehandler = require('./filehandler.js');

 var routeFunctions = require('./routesFunctions.js');

//For login
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');

var auth = ejwt({secret: config.secretToken});


module.exports = function(app) {


    app.route('/disciplines.json')
    .get(routeFunctions.getDisciplines);

    app.route('/disciplines/:id.json')
    .get(routeFunctions.getDiscipline);

    app.route('/journals.json')
    .get(routeFunctions.getJournals);

    app.route('/journals/:id.json')
    .get(routeFunctions.getJournal);

    app.route('/journals/:id/disciplines.json')
    .get(routeFunctions.getJournalDisciplines);

    app.route('/proceedings.json')
    .get(routeFunctions.getProceedings);

    app.route('/proceedings/:id.json')
    .get(routeFunctions.getProceeding);

    app.route('/proceedings/:id/disciplines.json')
    .get(routeFunctions.getProceedingDisciplines);

    app.route('/persons.json')
    .get(routeFunctions.getPersons)
    .post(routeFunctions.postPerson);

    app.route('/persons/:id.json')
    .get(routeFunctions.getPerson)
    .put(routeFunctions.putPerson);

    app.route('/persons/:id/publications.json')
    .get(routeFunctions.getPersonPublications);

    app.route('/users.json')
    .post(routeFunctions.postUser);

    app.route('/users/:id.json')
    .get(routeFunctions.getUser)
    .put(routeFunctions.putUser);

    app.route('/users/:id/library.json')
    .get(function(req, res) {res.status(501).end()});

    app.route('/publications.json')
    .get(routeFunctions.getPublications)
    .post(routeFunctions.postPublication);

    app.route('/publications/:id.json')
    .get(routeFunctions.getPublication);

    app.route('/publications/:id/authors.json')
    .get(routeFunctions.getPublicationAuthors);

    app.route('/login')
    .post(routeFunctions.login);

    app.route('/logout')
    .post(function(req, res) {res.status(501).end()});


    app.route('/users/login.json')
    .post(routeFunctions.postUserLogin);


    app.route('/uploadfile')
    .post(routeFunctions.postUploadFile);

    app.route('*')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });
};
