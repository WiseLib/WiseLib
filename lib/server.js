/*
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

var app = express();

//ERROR : bodyParser is now an external module, need to be added
//app.use(express.bodyParser());

app.get('/disciplines.json', function(req, res) {
    var dbManager = new DBManager('wilma.vub.ac.be', 'se2_1415');
    var result = dbManager.getDisciplines('se2_1415', 'Bacci98Goft', function(disciplines) {
        var jsonDis = [];
        for(var i = 0; i < disciplines.length; i++) {
            jsonDis.push(JSONManager.generateDiscipline(disciplines[i]));

app.get('/journals.json', function(req, res) {
    var dbManager = new DBManager('wilma.vub.ac.be', 'se2_1415');
    dbManager.getJournals('se2_1415', 'Bacci98Goft', function(journals) {
        var jsonJou = [];
        for(var i = 0; i < journals.length; i++) {
            jsonJou.push(JSONManager.generateJournal(journals[i]));
        }
        res.status(200).json({journals: jsonJou});
    });

})

app.get('/journals/:id.json', function(req, res) {
    var dbManager = new DBManager('wilma.vub.ac.be', 'se2_1415');
    dbManager.getJournal('se2_1415', 'Bacci98Goft', function(journal) {
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
  var dbManager = new manager.DBManager('wilma.vub.ac.be', 'se2_1415');
  var parsed = JSON.parse(req.body);
  if(parsed.type == "Journal"){
    var journal = new JournalPublication(parsed);
    dbManager.postJournalPublication('se2_1415', 'Bacci98Goft', function(respons){
      res.status(200).end();
    }, journal);
  } else if (parsed.type == "Proceeding"){
    var proceeding = new ProceedingPublication(parsed);
    dbManager.postProceedingPublication('se2_1415', 'Bacci98Goft', function(respons){
      res.status(200).end();
    },proceeding)
  } else {
    throw new Error("Not a valid publication type");
  }
})

/*
app.get('/discipline', function(req, res) {
    var dbManager = new manager.DBManager('wilma.vub.ac.be', 'se2_1415');
    //var discipline = {id:"Computer Science", parent:{id:"Computer Science"}};
    var disciplines = discipline.Discipline.parse(academic.disciplines);
    for(var i = 0; i < disciplines.length; i++) {
        dbManager.postDiscipline('se2_1415', 'Bacci98Goft', disciplines[i]);
        console.log('adding discipline ' + disciplines[i].id);
    }

    res.setHeader('Content-Type', 'text/plain');
    res.end('post publication');
});*/

app.listen(8080);

