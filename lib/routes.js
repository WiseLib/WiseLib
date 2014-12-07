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
var Config = require('./config.js');

// TODO: split this module up into multiple controllers

var paramsFromQuery = function(query) {
    var params = {};
    for(variable in query) {
        params[variable.toString()] = query[variable];
    }
    console.log('params : ' + JSON.stringify(params));
    return params;
}

module.exports = {

  '/disciplines': {
    'get': function(req, res) {
      var dbManager = new DBManager(Config);
      var params = paramsFromQuery(req.query);
      var result = dbManager.getDiscipline(params, function(disciplines) {
          varDis = [];
          for(var i = 0; i < disciplines.length; i++) {
             Dis.push(JSONManager.generateDiscipline(disciplines[i]));
          }
          res.status(200)({disciplines:Dis});
      });
    }
  },

  '/journals': {
    'get': function(req, res) {
      var dbManager = new DBManager(Config);
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

  '/journals/:id': {
    'get': function(req, res) {
      var dbManager = new DBManager(Config);
      dbManager.getJournal({id: req.params.id}, function(journals) {
          if(typeof journals[0] === 'undefined') {
              console.log('no journal found');
              res.status(404).end();
          }
          else {
              console.log('found journal ' + journals[0].id);
              res.status(200)(JSONManager.generateJournal(journals[0]));
          }
      });
    }
  },

  '/users/:id/publication': {
    'get': function(req,res){
      var dbManager = new manager.DBManager(Config);
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
  }
}

