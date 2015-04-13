'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 var config = require('./config.js');
 var routeFunctions = require('./routesFunctions.js');
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

    app.route('/affiliations.json')
    .get(routeFunctions.getAffiliations)
    .post(routeFunctions.postAffiliation);

    app.route('/affiliations/:id.json')
    .get(routeFunctions.getAffiliation);

    app.route('/persons.json')
    .get(routeFunctions.getPersons)
    .post(routeFunctions.postPerson);

    app.route('/persons/:id.json')
    .get(routeFunctions.getPerson)
    .put(auth, routeFunctions.putPerson);

    app.route('/persons/:id/publications.json')
    .get(routeFunctions.getPersonPublications);

    app.route('/users.json')
    .post(routeFunctions.postUser);

    app.route('/users/:id.json')
    .get(routeFunctions.getUser)
    .put(auth, routeFunctions.putUser);

    app.route('/users/:id/library.json')
    .get(function(req, res) {res.status(501).end();});

    app.route('/publications.json')
    .get(routeFunctions.getPublications)
    .post(auth, routeFunctions.postPublication);

    app.route('/publications/:id.json')
    .get(routeFunctions.getPublication)
    .delete(auth, routeFunctions.deletePublication);

    app.route('/publications/:id/authors.json')
    .get(routeFunctions.getPublicationAuthors);

    app.route('/login')
    .post(routeFunctions.login);

    app.route('/logout')
    .post(function(req, res) {res.status(501).end();});

    app.route('/uploadfile')
    .post(auth, routeFunctions.postUploadFile);

    app.route('*')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });
};
