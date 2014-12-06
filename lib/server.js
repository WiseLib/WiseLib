'user strict';
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
var Journal = require('./journal.js');
var Config = require('./config.js');


'use strict';

var app = express();

//ERROR : bodyParser is now an external module, need to be added
//app.use(express.bodyParser());

var paramsFromQuery = function(query) {
    var params = {};
    for(variable in query) {
        params[variable.toString()] = query[variable];
    }
    console.log('params : ' + JSON.stringify(params));
    return params;
}

app.get('/disciplines.json', function(req, res) {
    var dbManager = new DBManager(Config);

    var params = paramsFromQuery(req.query);
    var result = dbManager.getDiscipline(params, function(disciplines) {
        var jsonDis = [];
        for(var i = 0; i < disciplines.length; i++) {
            jsonDis.push(JSONManager.generateDiscipline(disciplines[i]));
        }
        res.status(200).json({disciplines: jsonDis});
    });

});

app.get('/journals.json', function(req, res) {
    var dbManager = new DBManager(Config);
    var params = paramsFromQuery(req.query);
    dbManager.getJournal(params, function(journals) {
        var jsonJou = [];
        for(var i = 0; i < journals.length; i++) {
            jsonJou.push(JSONManager.generateJournal(journals[i]));
        }
        res.status(200).json({journals: jsonJou});
    });

})

app.get('/journals/:id.json', function(req, res) {
    var dbManager = new DBManager(Config);
    dbManager.getJournal({id: req.params.id}, function(journals) {
        if(typeof journals[0] === "undefined") {
            console.log('no journal found');
            res.status(404).end();
        }
        else {
            console.log('found journal ' + journals[0].id);
            res.status(200).json(JSONManager.generateJournal(journals[0]));
        }
    });
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
/*
var fs = require('fs');
app.get('/journals', function(req, res) {
    var dbManager = new DBManager(Config);
    fs.readFile('./journals.json', 'utf8', function(err, data) {
        if(err) throw err;
        var jsonArr = JSON.parse(data);
        dbManager.getDiscipline({}, function(disciplines) {
            for(var i = 0; i < jsonArr.length; i++) {
                var journal = new Journal(jsonArr[i].name, jsonArr[i].rank);
                for(var j = 0; j < jsonArr[i].disciplines.length; j++) {
                    for(var k = 0; k < disciplines.length; k++) {
                        if(jsonArr[i].disciplines[j].name === disciplines[k].name) {
                            journal.disciplines.push(disciplines[k]);
                        }
                    }
                }
                console.log(journal.name + ' ' + journal.rank + ' ' + journal.disciplines);
                dbManager.postJournal(journal, function(j) {});
            }
        });
    });
    res.end('add journal');     
});

app.get('/disciplines', function(req, res) {
    var dbManager = new DBManager(Config);
    fs.readFile('./academicdisciplines.json', 'utf8', function(err, data) {
        if (err) throw err;
        var resArr = [];
        var jsonArr = JSON.parse(data).disciplines;
        dbManager.getDiscipline({}, function(disciplines) {
            console.log(disciplines.length);
            for(var i = 0; i < jsonArr.length; i++) {
                for(var j = 0; j < disciplines.length; j++) {
                    if(jsonArr[i].parentId === disciplines[j].name) {
                        var d = new Discipline(jsonArr[i].name);
                        disciplines[j].addChild(d);
                        console.log('found : ' + d.name + ' with parent ' + d.parent.name);
                        resArr.push(d);
                    }
                }
            }
            for(var i = 0; i < resArr.length; i++) {
                var found = false;
                for(var j = 0; j < disciplines.length; j++) {
                    if(resArr[i].name === disciplines[j].name) {
                        found = true;
                    }
                }
                if(!found) {
                    console.log('posting : ' + resArr[i].name + ' with parent ' + resArr[i].parent.name);
                    dbManager.postDiscipline(resArr[i], function(res) {});
                }
            }
            if(disciplines.length === 0) {
                dbManager.postDiscipline(new Discipline('Computer Science'), function(res) {});
            }
        });
        res.end('added disciplines');
    });
    
});*/

//redirect for static files
app.get('*', function(req, res) {
    res.sendFile(req.path, {root:__dirname + '/public/'});
});

app.listen(8080);
