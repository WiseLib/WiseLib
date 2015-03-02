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
        dbManager.get(params, linker.disciplineRepr, function(disciplines) {
            res.json({
                disciplines: disciplines.map(function (discipline) {
                    return JSONManager.generateDiscipline(discipline);
                })
            });
        });
    });

    app.route('/journals.json')
    .get(function(req, res) {
        var params = req.query;
        dbManager.get(params, linker.journalRepr, function(journals) {
            res.json({
                journals: journals.map(function (journal) {
                    return JSONManager.generateJournal(journal);
                })
            });
        });
    });

    app.route('/proceedings.json')
    .get(function(req, res) {
        var params = req.query;
        dbManager.get(params, linker.proceedingRepr, function(proceedings) {
            res.json({
                proceedings: proceedings.map(function (proceeding) {
                    return JSONManager.generateProceeding(proceeding);
                })
            });
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
                res.json(JSONManager.generateJournal(journals[0]));
            }
        });
    });

    app.route('/persons.json')
    .get(function (req, res) {
        var params = req.query;
        //dbManager.put({id:9064, firstName: 'Mathieu'}, linker.personRepr, function(id) {console.log('updated!')});
        dbManager.get(params, linker.personRepr, function(persons) {
            res.json({
                persons: persons.map(function (person) {
                    return JSONManager.generatePerson(person);
                })
            });
        });
    })
    .put(function (req, res) {
        dbManager.put(req.body, linker.personRepr, function(id) {
            res.status(200).end();
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
                res.json({token: token});
            }, function(error) {
                res.status(500).json({error: error});
            });
        };
        if(req.body.personId === undefined) {
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
    })
    .put(function (req, res) {
        dbManager.put(req.body, linker.userRepr, function(id) {
            res.status(200).end();
        });
    })
    .patch(function (req, res) {
        console.log('patching user');
    });

    app.route('/users/:id/publications.json')
    .get(function(req, res) {
        dbManager.get({uploader: req.params.id}, linker.publicationRepr, function(publications) {
            res.json({
                publications: publications.map(function (publication) {
                    return JSONManager.generatePublication(publication);
                })
            });
        });
    })
    .post(auth, function(req, res) {
        var jsonObj = req.body;
        switch (jsonObj.type) {
            case 'Journal':
            dbManager.postJournalPublication(jsonObj, function(id) {
                res.end();
            });
            break;
            case 'Proceeding':
            dbManager.postProceedingPublication(jsonObj, function(id) {
                res.end();
            });
            break;
            default:
            throw new Error('Not a valid publication type');
        }
    });

    app.route('/users/login.json')
    .post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if(email === '' || password === '') {
            res.sendStatus(401);
        }
        var onSuccess = function(users) {
            if(users.length === 1) {
                var token = jwt.sign(users[0], config.secretToken, { expiresInMinutes: 60 });
                res.json({token: token});
            } else {
                res.status(401).json({error: 'Wrong email or password'});
            }
            
        };
        dbManager.get({email: email, password: password}, linker.userRepr, onSuccess);
    });

    app.route('/uploadfile')
        .post(function(req,res){
            var WrongType = function(){
                res.status(400).send('Not a pdf or bibtex');
            };

            var OnEnd= function(data){
                res.json(data);
            };

            filehandler.handleFile(req,WrongType,OnEnd);
        });

    app.route('*')
    .get(function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../public/'});
    });
};
