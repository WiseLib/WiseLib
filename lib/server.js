,/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

var express = require('express');
var JSONManager = require('./jsonmanager.js');
var DBManager = require('./dbmanager.js');
var Discipline = require('./discipline.js');
var Config = require('./config.js');

var app = express();

//ERROR : bodyParser is now an external module, need to be added
//app.use(express.bodyParser());

app.get('/disciplines.json', function(req, res) {
    var dbManager = new DBManager(Config);
    var result = dbManager.getDisciplines(function(disciplines) {
        var jsonDis = [];
        for(var i = 0; i < disciplines.length; i++) {
            jsonDis.push(JSONManager.generateDiscipline(disciplines[i]));
        }
        res.status(200).json({disciplines: jsonDis});
    });

});

app.get('/journals.json', function(req, res) {
    var dbManager = new DBManager(Config);
    dbManager.getJournals(function(journals) {
        var jsonJou = [];
        for(var i = 0; i < journals.length; i++) {
            jsonJou.push(JSONManager.generateJournal(journals[i]));
        }
        res.status(200).json({journals: jsonJou});
    });

})

app.get('/journals/:id.json', function(req, res) {
    var dbManager = new DBManager('wilma.vub.ac.be', 'se2_1415');
    dbManager.getJournal('user', 'password', function(journal) {
        if(typeof journal === "undefined") {
            console.log('no journal found');
            res.status(404).end();
        }
        else {
            console.log('found journal ' + journal.id);
            res.status(200).json(JSONManager.generateJournal(journal));
        }
    }, req.params.id);
});

app.post('/users/:id/publication.json', function(req,res){
  var dbManager = new manager.DBManager(Config);
  var parsed = JSON.parse(req.body);
  if(parsed.type == "Journal"){
    var journal = new JournalPublication(parsed);
    dbManager.postJournalPublication(function(respons){
      res.status(200).end();
    }, journal);
  } else if (parsed.type == "Proceeding"){
    var proceeding = new ProceedingPublication(parsed);
    dbManager.postProceedingPublication(function(respons){
      res.status(200).end();
    },proceeding)
  } else {
    throw new Error("Not a valid publication type");
  }
});

app.get('/upload', function(req, res) {
    res.sendFile('upload.html', {root:__dirname + '/public/'});
});

//redirect for static files
app.get('*', function(req, res) {
    res.sendFile(req.path, {root:__dirname + '/public/'});
});
/*
var fs = require('fs');
app.get('/disciplines', function(req, res) {
    var dbManager = new DBManager(Config);
    
    fs.readFile('./academicdisciplines.json', 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
        var disciplines = JSONManager.parseDiscipline(data);
        console.log(disciplines);
        for(var i = 0; i < disciplines.length; i++) {
            dbManager.postDiscipline(disciplines[i]);
        }
        res.end('added disciplines');
    });
    

});*/

app.listen(8080);
