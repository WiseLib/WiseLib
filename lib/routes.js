'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */


var _ = require('lodash');
var JSONManager = require('./jsonmanager.js');
var DBManager = require('./dbmanager.js');
var Discipline = require('./discipline.js');
var Journal = require('./journal.js');
var config = require('./config.js');

//For login
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');
var secret = require('./secret.js');

// TODO: split this module up into multiple controllers

/**
 * Checks if <tt>email</tt> is a valid email address.
 * @param  {string} email
 * @return {boolean}
 */
// FIXME: put me somewhere else or use a module
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var paramsFromQuery = function(query) {
    var params = {};
    for(var variable in query) {
        params[variable.toString()] = query[variable];
    }
    console.log('params : ' + JSON.stringify(params));
    return params;
}

var dbManager = new DBManager(config.database);
var auth = ejwt({secret: secret.secretToken});

module.exports = function(app) {
    app.route('/disciplines.json')
    .get(function(req, res) {
        var params = paramsFromQuery(req.query);
        var result = dbManager.getDiscipline(params, function(disciplines) {
            var varDis = [];
            var result = dbManager.getDiscipline(params, function(disciplines) {
                varDis = [];
                for(var i = 0; i < disciplines.length; i++) {
                    varDis.push(JSONManager.generateDiscipline(disciplines[i]));
                }
                res.status(200).json({disciplines:varDis});
            });
        });
    });

    app.route('/journals.json')
    .get(function(req, res) {
        var params = paramsFromQuery(req.query);
        dbManager.getJournal(params, function(journals) {
            var Jou = [];
            for(var i = 0; i < journals.length; i++) {
                Jou.push(JSONManager.generateJournal(journals[i]));
            }
            res.status(200).json({journals:Jou});
        });
    });

    app.route('/journals/:id.json')
    .get(function(req, res) {
        dbManager.getJournal({id: req.params.id}, function(journals) {
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
        var params = paramsFromQuery(req.query);
        dbManager.getPerson(params, function(persons) {
            var pers = [];
            for(var i = 0; i < persons.length; i++) {
                pers.push(JSONManager.generatePerson(persons[i]));
            }
            response.status(200).json({persons:pers});
        });
    });

    app.route('/user.json')
    .post(function(req, res) {
        var onSuccess = function(id) {
            res.json({id: id});
        }
        dbManager.postUser(req.body, onSuccess);
    });

    app.route('/users/:id/publications.json')
    .post(auth, function(req,res) {
        var jsonObj = req.body;
        if(jsonObj.type == 'Journal'){
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
            console.log(user);
            if(user[0].password == password) {
                var token = jwt.sign(user[0], secret.secretToken, { expiresInMinutes: 60 });
                return res.json({token:token});
            } else {
                return res.sendStatus(401);
            }
        };

        dbManager.getUser({email_address:email}, onSuccess);
    });

    app.route('/restricted.json')
    .get(auth, function(req, res) {
        return res.status(200).json({'feedback': 'this is awesome!'});
    });

    app.route('/upload')
    .get(function(req, res) {
        res.sendFile('index.html', {root:__dirname + '/../public/'});
    });

    app.route('/register')
    .get(function(req, res) {
        res.sendFile('index.html', {root:__dirname + '/../public/'});
    });

    app.route('/login')
    .get(function(req, res) {
        res.sendFile('index.html', {root:__dirname + '/../public/'});
    });
}

