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

module.exports = {

  '/disciplines.json': {
    'get': function(req, res) {
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
    }
  },

  '/journals.json': {
    'get': function(req, res) {
      var params = paramsFromQuery(req.query);
      dbManager.getJournal(params, function(journals) {
          var Jou = [];
          for(var i = 0; i < journals.length; i++) {
             Jou.push(JSONManager.generateJournal(journals[i]));
          }
          res.status(200).json({journals:Jou});
      });
    }
  },

  '/journals.json:id': {
    'get': function(req, res) {
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
      var pubObj = {title: "bla", type:"Journal", numberOfPages: 2, year:2015, url:'www.iamawesome.com', keywords:[], 
      disciplines:[{id:2}, {id:3}], authors:[{id:1}], journalId:10, volume:5, number:3};
      JSONManager.parsePublication(JSON.stringify(pubObj), function(pub) {
        console.log('Publication : ' + JSON.stringify(pub));
      })
    }
  },

  '/persons.json': {
    'get': function (req, response) {
      var params = paramsFromQuery(req.query);
      dbManager.getPerson(params, function(persons) {
        var pers = [];
        for(var i = 0; i < persons.length; i++) {
          pers.push(JSONManager.generatePerson(persons[i]));
        }
        response.status(200).json({persons:pers});
      });
    },
    'post': function (req, response) {
        var dbscheme = require('./db.js');
        var Client = require('mariasql');
        var c = new Client();
        c.connect(config.database);
        // other validations need to be added
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
    }
  },

  '/users/:id/publication.json': {
    'get': function(req,res){
      var parsed = JSON.parse(req.body);
      if(parsed.type == 'Journal'){
        var journal = new JournalPublication(parsed);
        dbManager.postJournalPublication(function(respons){
          res.status(200).end();
        }, journal);
      } else if (parsed.type == 'Proceeding'){
        var proceeding = new ProceedingPublication(parsed);
        dbManager.postProceedingPublication(function(respons){
          res.status(200).end();
        },proceeding)
      } else {
        throw new Error('Not a valid publication type');
      }
    }
  },

  '/upload': {
    'post': function(req, res) {
      res.sendFile('upload.html', {root:__dirname + '/../public/'});
    }
  },
  '/register': {
    'get': function(req, res) {
      res.sendFile('index.html', {root:__dirname + '/../public/'});
    }
  }
}

