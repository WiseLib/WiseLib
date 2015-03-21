'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

 var validator = require('./validator.js');
 var DBManager = require('./dbmanager.js');
 var config = require('./config.js');
 var linker = require('./linker.js');
 var imageSaver = require('./imagesaver.js');
 var filehandler = require('./filehandler.js');

//For login
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');

// TODO: split this module up into multiple controllers

var auth = ejwt({secret: config.secretToken});

//need to add authentification options
var getMultiple = function(req, res, repr, name) {
    var params = req.query;
    DBManager.get(params, repr, function(results) {
        res.json({
            name: results
        });
    });
};
//need to add authentification options
var getSingle = function(req, res, repr) {
    DBManager.get({id: req.params.id}, repr, function(results) {
        if(results[0] === undefined) {
            res.status(404).end();
        }
        else {
            res.json(results[0]);
        }
    });
};
//need to add authentification options
var postSingle = function(req, res, repr, then) {
    DBManager.post(req.body, repr, function(id) {
        res.status(200).end();
    });
};
//need to add authentification options
var putSingle = function(req, res, repr) {
    DBManager.put(req.body, repr, function(id) {
        res.status(200).end();
    });
};

var getDisciplines = function(req, res) {
    getMultiple(req, res, linker.disciplineRepr, 'disciplines');
};
var getDiscipline = function(req, res) {
    getSingle(req, res, linker.disciplineRepr);
};
var getJournals = function(req, res) {
    getMultiple(req, res, linker.journalRepr, 'journals');
};
var getJournal = function(req, res) {
    getSingle(req, res, linker.journalRepr);
};
var getJournalDisciplines = function(req, res) {
    req.query.journal = req.params.id;
    getMultiple(req, res, linker.disciplineRepr, 'disciplines');
};
var getProceedings = function(req, res) {
    getMultiple(req, res, linker.proceedingRepr, 'proceedings');
};
var getProceeding = function(req, res) {
    getSingle(req, res, linker.proceedingRepr);
};
var getProceedingDisciplines = function(req, res) {
    req.query.proceeding = req.params.id;
    getMultiple(req, res, linker.disciplineRepr, 'disciplines');
};
var getPersons = function(req, res) {
    getMultiple(req, res, linker.personRepr, 'persons');
};
var getPerson = function(req, res) {
    getSingle(req, res, linker.personRepr);
};
var getPersonPublications = function(req, res) {
    req.query.authors = [req.params.id];
    getMultiple(req, res, linker.publicationRepr, 'publications');
};
var postPerson = function(req, res) {
    postSingle(req, res, linker.personRepr);
};
var putPerson = function(req, res) {
    putSingle(req, res, linker.personRepr);
};
var getUser = function(req, res) {
    getSingle(req, res, linker.userRepr);
};
//redirect to login page ?
var postUser = function(req, res) {
    if(req.body.profileImageSrc) {
        req.body.picture = imageSaver(req.body.profileImageSrc);
    }
    postSingle(req, res, linker.userRepr);
};
var putUser = function(req, res) {
    putSingle(req, res, linker.userRepr);
};
var getPublications = function(req, res) {
    getMultiple(req, res, linker.publicationRepr, 'publications');
};
var getPublication = function(req, res) {
    getSingle(req, res, linker.publicationRepr);
};
var postPublication = function(req, res) {
    res.status(501).end();
};
var getPublicationAuthors = function(req, res) {
    req.query.publications = [req.params.id];
    getMultiple(req, res, linker.personRepr, 'persons');
};
//token ?
/*
var token = jwt.sign(id, config.secretToken, { expiresInMinutes: 60 });
res.json({token: token});
*/
var login = function(req, res) {
    res.status(501).end();
};

module.exports = function(app) {

    app.route('/disciplines.json')
    .get(getDisciplines);
    app.route('/disciplines/:id.json')
    .get(getDiscipline);
    app.route('/journals.json')
    .get(getJournals);
    app.route('/journals/:id.json')
    .get(getJournal);
    app.route('/journals/:id/disciplines.json')
    .get(getJournalDisciplines);
    app.route('/proceedings.json')
    .get(getProceedings);
    app.route('/proceedings/:id.json')
    .get(getProceeding);
    app.route('/proceedings/:id/disciplines.json')
    .get(getProceedingDisciplines);
    app.route('/persons.json')
    .get(getPersons)
    .post(postPerson);
    app.route('/persons/:id.json')
    .get(getPerson)
    .put(putPerson);
    app.route('/persons/:id/publications.json')
    .get(getPersonPublications);
    app.route('/users.json')
    .post(postUser);
    app.route('/users/:id.json')
    .get(getUser)
    .put(putUser);
    app.route('/users/:id/library.json')
    .get(function(req, res) {res.status(501).end()});
    app.route('/publications.json')
    .get(getPublications)
    .post(postPublication);
    app.route('/publications/:id.json')
    .get(getPublication);
    app.route('/publications/:id/authors.json')
    .get(getPublicationAuthors);
    app.route('/login')
    .post(login);
    app.route('/logout')
    .post(function(req, res) {res.status(501).end()});

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
