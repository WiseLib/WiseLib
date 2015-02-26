'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

var _ = require('lodash');
var validator = require('./validator.js');
var JSONManager = require('./jsonmanager.js');
var DBManager = require('./dbmanager.js');
var Discipline = require('./discipline.js');
var Journal = require('./journal.js');
var config = require('./config.js');
var linker = require('./linker.js');
var imageSaver = require('./imagesaver.js');

//For login
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');

// TODO: split this module up into multiple controllers

var dbManager = new DBManager(config.database);
var auth = ejwt({secret: config.secretToken});

module.exports = function(app) {

    app.route('/disciplines.json')
      .get(function(req, res) {
        var params = req.query;
        var result = dbManager.get(params, linker.disciplineRepr, function(disciplines) {  
            var varDis = [];
            for(var i = 0; i < disciplines.length; i++) {
                varDis.push(JSONManager.generateDiscipline(disciplines[i]));
            }
            res.status(200).json({disciplines: varDis});
        });
    });

    app.route('/journals.json')
      .get(function(req, res) {
        var params = req.query;
            dbManager.get(params, linker.journalRepr, function(journals) {
                var Jou = [];
                for(var i = 0; i < journals.length; i++) {
                    Jou.push(JSONManager.generateJournal(journals[i]));
                }
                res.status(200).json({journals: Jou});
            });
        });

    app.route('/journals/:id.json')
      .get(function(req, res) {
        dbManager.get({id: req.params.id}, linker.journalRepr, function(journals) {
            if(typeof journals[0] === 'undefined') {
                console.log('no journal found');
                res.status(404).end();
            }
          else {
                console.log('found journal ' + journals[0].id);
                res.status(200).json(JSONManager.generateJournal(journals[0]));
            }
        });
    });

    app.route('/persons.json')
      .get(function (req, response) {
        var params = req.query;
        dbManager.get(params, linker.personRepr, function(persons) {
            var pers = [];
            for(var i = 0; i < persons.length; i++) {
                pers.push(JSONManager.generatePerson(persons[i]));
            }
            response.status(200).json({persons: pers});
        });
    });

    app.route('/user.json')
    .post(function(req, res) {
        if(req.body.profileImageSrc)
            req.body.picture = imageSaver(req.body.profileImageSrc);
        var getUser = function(personId) {
            req.body.personId = personId;
            dbManager.post(req.body, linker.userRepr, function(id) {
                var token = jwt.sign(id, config.secretToken, { expiresInMinutes: 60 });
                return res.json({token: token});
            }, function(error) {
                return res.status(500).json({error: error});
            });
        };
        if(req.body.personId == undefined) {
            console.log(req.body);
            dbManager.post(req.body, linker.personRepr, function(id) {
                getUser(id);
            }, function(error) {
                return res.status(500).json({error: error});
            });
        }
        else {
            getUser(req.body.personId);
        }
    });

    app.route('/users/:id/publications.json')
    .post(auth, function(req, res) {
        var jsonObj = req.body;
        if(jsonObj.type == 'Journal') {
            dbManager.postJournalPublication(jsonObj, function(id) {
                res.status(200).end();
            });
        }
        else if (jsonObj.type == 'Proceeding') {
            dbManager.postProceedingPublication(jsonObj, function(id) {
                res.status(200).end();
            });
        }
        else {
            throw new Error('Not a valid publication type');
        }
    });

    app.route('/users/login.json')
    .post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if(email == '' || password == '') {
            return res.sendStatus(401);
        }
        var onSuccess = function(user) {
            var token = jwt.sign(user[0]['id'], config.secretToken, { expiresInMinutes: 60 });
            return res.json({token: token});
        };
        dbManager.get({email: email, password: password}, linker.userRepr, onSuccess);
    });

    app.route('/restricted.json')
    .get(auth, function(req, res) {
        return res.status(200).json({'feedback': 'this is awesome!'});
    });

    app.route('/upload')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });

    app.route('/register')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });

    app.route('/login')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });
};
