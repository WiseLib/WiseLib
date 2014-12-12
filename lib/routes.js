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

  '/journals/:id.json': {
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
      /*works
      var pubObj = {title: "bla", type:"Journal", numberOfPages: 2, year:2015, url:'www.iamawesome3.com', keywords:[], 
      disciplines:[{id:2}, {id:3}], authors:[{id:1}], journalId:10, volume:5, number:3};
      console.log('Publication : ' + JSON.stringify(pubObj));
      dbManager.postJournalPublication(pubObj, function(id) {console.log('added publication : id ' + id);});*/
      /*works
      var disObj = {name: "TEST", parentId:1};
      console.log('Discipline : ' + JSON.stringify(disObj));
      dbManager.postDiscipline(disObj, function(id) {console.log('added discipline : id ' + id)});*/
      /*works
      var jouObj = {name: 'TEST', rank:0, disciplines:[{id:1}, {id:73}]};
      console.log('Journal : ' + JSON.stringify(jouObj));
      dbManager.postJournal(jouObj, function(id) {console.log('added journal : id ' + id)});*/
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
    }
  },
  '/user.json': {
    'post': function(req, res) {
      var onSuccess = function(id) {
        res.json({id: id});
      }
      dbManager.postUser(req.body, onSuccess);
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
    'get': function(req, res) {
      res.sendFile('index.html', {root:__dirname + '/../public/'});
    }
  },
  '/register': {
    'get': function(req, res) {
      res.sendFile('index.html', {root:__dirname + '/../public/'});
    }
  }
}

