var inspect = require('util').inspect;
var Client = require('mariasql');
var Discipline = require('./discipline.js');

var DBManager = function(host, database) {
    this.host = host;
    this.database = database;
};

DBManager.prototype.connect = function(user, password){
    var client = new Client();
    client.connect({
        host: this.host,
        user: user,
        password: password,
        db: this.database
    });
    
    return client;
};

DBManager.prototype.onSuccess = function(success) {
    console.log('Success : ' + success);
    return 200;
};

DBManager.prototype.onError = function(error) {
    console.log('Error : ' + error);
    return 404;
};

DBManager.prototype.executeQuery = function(user, password, query, queryParams, onSuccess, onError) {
    queryParams = (typeof queryParams === "undefined") ? {} : queryParams;
    onSuccess = (typeof onSuccess === "undefined") ? DBManager.prototype.onSuccess : onSuccess;
    onError = (typeof onError === "undefined") ? DBManager.prototype.onError : onError;
    var client = this.connect(user, password);
    var query = client.query(query, queryParams);
    var result = query.on('result', onSuccess)
        .on('error', onError);
    
    client.end();

    return result;
};

DBManager.prototype.getDisciplines = function(user, password, next) {
    var onSuccess = function(res) {
        var discObj = {};
        var discArr = [];
        var discPar = [];
        var result = res.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
            var disc = new Discipline(row.id);
            discObj[row.id] = disc;
            discArr.push(disc)
            discPar.push(row.part_of_academic_discipline_id);
        })
        .on('end', function(info) {
            for(var i = 0; i < discArr.length; i++) {
                discArr[i].addChild(discObj[discPar[i]]);
            }
            next(discArr);
        }); 
    }
    var result = this.executeQuery(user, password, 'SELECT * FROM academic_discipline', undefined, onSuccess); 
    return result;
};

DBManager.prototype.postDiscipline = function(user, password, discipline) {
    var result = this.executeQuery(user, password, 'INSERT INTO academic_discipline VALUES (:id, :part_of)', {id: discipline.id, part_of: discipline.parent.id});
    return result;
};

DBManager.prototype.getJournal = function(user, password, next, id) {
    var manager = this;
    //will be called once we got all disciplines from database
    var nextDisciplines = function(disciplines) {
        var onSuccess = function(res) {
            var journal;
            dis = [];
            res.on('row', function(row) {
                //create journal once
                if(typeof journal === "undefined") {
                    journal = new Journal(row.id, row.rank, []);
                }
                //get all journal disciplines
                dis.push(row.academic_discipline_id);
            })
            .on('end', function(info) {
                //add journal disciplines to journal
                for(var i = 0; i < disciplines.length; i++) {
                    for(var j = 0; j < dis.length; j++) {
                        if(dis[j] == disciplines[i].id) {
                            journal.disciplines.push(disciplines[i]);
                        }
                    }
                }
                //callback
                next(journal);
            });
        }
        var query = 'SELECT * FROM journal INNER JOIN journal_has_academic_discipline ' +
                    'ON journal.id = journal_has_academic_discipline.journal_id '+
                    'WHERE journal.id = :id';
        manager.executeQuery(user, password, query, {id: id}, onSuccess);
    }
    //first get disciplines
    this.getDisciplines(user, password, nextDisciplines);
    
};

DBManager.prototype.getJournals = function(user, password, next) {

    var query = 'SELECT id FROM journal';
    var onSuccess = function(res) {
        journals = [];
        //for each journal id, find the corresponding journal
        res.on('row', function(row) {
            this.getJournal(user, password, function(journal) {
                journals.push(journal);
            }, row.id);
        })
        .on('end', function(info) {
            next(journals);
        });
    }
    this.executeQuery(user, password, query, undefined, onSuccess);
};

DBManager.prototype.postJournal = function(user, password, journal) {
    var manaer = this;
    //insert journal in table
    var query = 'INSERT INTO journal VALUES (:id, :rank)';
    var queryParams = {id: journal.id, rank: journal.rank};
    //if succeeded, insert journal disciplines
    var onSuccess = function(res) {
        //add all journal disciplines in journal_has_academic_discipline table
        for(var i = 0; i < journal.disciplines.length; i++) {
            var query = 'INSERT INTO journal_has_academic_discipline VALUES (:journal_id, :discipline_id)';
            var queryParams = {journal_id: journal.id, discipline_id: journal.disciplines[i].id};
            manager.executeQuery(user, password, query, queryParams);
        }
        
    }

    this.executeQuery(user, password, query, queryParams, onSuccess);
};

//Exports
module.exports = DBManager;
/*
exports.DBManager.prototype.connect = DBManager.prototype.connect;
exports.DBManager.prototype.getDisciplines = DBManager.prototype.getDisciplines;
exports.DBManager.prototype.postDiscipline = DBManager.prototype.postDiscipline;
exports.DBManager.prototype.getJournal = DBManager.prototype.getJournal;
exports.DBManager.prototype.getJournals = DBManager.prototype.getJournals;
exports.DBManager.prototype.postJournal = DBManager.prototype.postJournal;*/
