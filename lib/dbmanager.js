'use strict';
var inspect = require('util').inspect;
var Client = require('mariasql');
var Discipline = require('./discipline.js');
var Journal = require('./journal.js');
var User = require('./user.js');
var Person = require('./person.js');
var linker = require('./linker.js');
var dbscheme = require('./db.js');
/**
 * The Database manager. This manager communicates with the database via a config object.
 * For each class of the core module, the database has methods to get/put/post/delete objects of the core module.
 * @param {object} config - The config file needed to connect to the database.
 * @config {string} host - The name of the database's host
 * @config {string} database - The name of the database
 * @config {string} user - The user which will connect to the database
 * @config {string} password - The user's password
 *
 * @constructor
 */
var DBManager = function(config) {
    this.host = config.host;
    this.database = config.db;
    this.user = config.user;
    this.password = config.password;
};

/**
 * Make a connection to the database.
 * The connection will need to be closed.
 * @method
 */
DBManager.prototype.connect = function(){
    var client = new Client();
    client.connect({
        host: this.host,
        user: this.user,
        password: this.password,
        db: this.database,
        multiStatements: true
    });

    return client;
};

/**
 * When a query is executed, a callback is expected on success (and another one on failure).
 * This is the default callback that will be called when a query was succesfully executed.
 * @callback DBManager~onSuccess
 */
DBManager.prototype.onSuccess = function(success) {
    console.log('Success : ' + success);
    return 200;
};

/**
 * When a query is executed, a callback is expected on failure (and another one on success).
 * This is the default callback that will be called when a query errored.
 * @callback DBManager~onError
 */
DBManager.prototype.onError = function(error) {
    console.log('Error : ' + error);
    return 404;
};

DBManager.prototype.onEnd = function() {
    console.log('Ended query');
};

/**
 * The DBManager needs to execute queries to communicate with the database.
 * This happens with this method. A query is given and will be executed.
 * The query can have optional parameters :
 *   for example : 'SELECT * FROM publication WHERE id=:id', where :id is a parameter
 * @param {string} query - The query that will be executed
 * @param {object} [queryParams] - An object containing the queries's parameters
 * @param {function} [onSuccess] - A callback function that will be executed when a query has successfully been executed.
 * @param {function} [onError] - A callback function that will be executed when a query has errored.
 * @method
 * @private
 */
DBManager.prototype.executeQuery = function(query, queryParams, onSuccess, onError, onEnd) {
    queryParams = (typeof queryParams === 'undefined') ? {} : queryParams;
    onSuccess = (typeof onSuccess === 'undefined') ? DBManager.prototype.onSuccess : onSuccess;
    onError = (typeof onError === 'undefined') ? DBManager.prototype.onError : onError;
    onEnd = (typeof onEnd === 'undefined') ? DBManager.prototype.onEnd : onEnd;
    var client = this.connect();
    var query = client.query(query, queryParams);
    var result = query.on('result', onSuccess)
        .on('error', onError).on('end', onEnd);

    client.end();

    return result;
};

/**
 * This method will give an array of Discipline objects according to the params given as parameter.
 * For now, only a subset of the possible parameters is supported.
 * @config {string} id - The Discipline's id
 * @public
 */
DBManager.prototype.getDiscipline = function(params, next) {
    //messy : we first take all disciplines from db and
    //then select the ones we want depending on the params
    var onSuccess = function(res) {
        var discObj = {};
        var discArr = [];
        var discPar = [];
        //for each row we found : create a discipline (without adding the parents),
        //and add it to Array
        var result = res.on('row', function(row) {
            var disc = new Discipline(row.name);
            disc.id = row.id;
            discObj[row.id] = disc;
            discArr.push(disc);
            if(row.part_of_academic_discipline_id === null) {
                discPar.push(row.id);
            }
            else {
                discPar.push(row.part_of_academic_discipline_id);
            }
        })
        //once we created all disciplines, loop over them to add parent relation
        .on('end', function(info) {
            var resArray = [];
            for(var i = 0; i < discArr.length; i++) {
                discObj[discPar[i]].addChild(discArr[i]);
                //select the discipline depending on the given params
                //matching id
                if(params.id === discArr[i].id.toString()) {
                    resArray.push(discArr[i]);
                }
                //matching name
                else if(params.name === discArr[i].name) {
                    resArray.push(discArr[i]);
                }
                //matching parent
                else if(params.parentId === discArr[i].parent.id.toString()) {
                    resArray.push(discArr[i]);
                }
                //no parameters given : all results are valid
                else if(JSON.stringify(params) === JSON.stringify({})) {
                    resArray.push(discArr[i]);
                }
            }
            next(resArray);
        });
    };
    //var queryOptions = linker.queryOptions(params, linker.disciplineRepr);
    //this.executeQuery('SELECT * FROM academic_discipline' + queryOptions, params, onSuccess);
    this.executeQuery('SELECT * FROM academic_discipline', undefined, onSuccess);
};

/*
 * This method will update an existing discipline in the database with the given Discipline object.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * The callback has one parameter : an array of returned Discipline objects.
 * @param {object} json Exp- The json Expression representing the Discipline that will be updated.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.putDiscipline = function(jsonExp, next) {
    throw 'not yet implemented : putDiscipline';
};

/**
 * Adds a new non-existing Discipline to the database.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * @param {object} jsonExp - A json Expression representing the discipline that will be added.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.postDiscipline = function(jsonObj, next) {
    var query = 'INSERT INTO academic_discipline (name, part_of_academic_discipline_id) VALUES ' +
                 '(:name, :parentId)';
    var onSuccess = function(res) {
        res.on('end', function(info) {
            next(info.insertId);
        });
    };
    var result = this.executeQuery(query, jsonObj, onSuccess);
};

/**
 * Delete an existing Discipline from the database.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * @param {Discipline} discipline - The Discipline that will be deleted.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.deleteDiscipline = function(discipline, next) {
    var result = this.executeQuery('DELETE FROM academic_discipline WHERE id=:id', {id: discipline.id});
};

/**
* Adds a new non-existing Journal or Conference to the database, depends on the given param db.
* Because queries are asynchronous, a callback is needed for when the query finished.
* @param {object} jsonObj - The Journal that will be added.
* @param {function} next - The callback that will be executed at the end of the query.
* @param {string} db - The name of the database where the information needs to be stored. Can be conference or journal.
* @param {string} discDb - The name of the database that links the conference or journal to the disciplines.
* @public
*/
DBManager.prototype.postAlbum= function(jsonObj, next, db, discDb) {
    var dbManager = this;
    //first query to be executed : insert journal
    var query = 'INSERT INTO ' + db + ' (name, rank) VALUES (:name, :rank)';
    var queryParams = {name: jsonObj.name, rank: jsonObj.rank};
    //if first query is a success, execute this function
    var onSuccess = function(res) {
        res.on('end', function(info) {
            //get id of added journal
            var id = info.insertId;

            console.log('updated id : ' + id);
            var q = '';
            var p = {id: id};
            //make a list of queries to add the journal disciplines
            for(var i = 0; i < jsonObj.disciplines.length; i++) {
                q  += 'INSERT INTO '+ discDb + ' (' + db + '_id, academic_discipline_id) ' +
                'VALUES (:id, :discipline_id_' + i + ');';
                p['discipline_id_' + i] = jsonObj.disciplines[i].id;
            }
            //when list of queries finished : execute this function
            var onEnd = function() {
                next(id);
            }
            console.log('queries : ' + q);
            //remove the ';' from the last query
            dbManager.executeQuery(q.substring(0, q.length-1), p, undefined, undefined, onEnd);
        });
    }
    this.executeQuery(query, queryParams, onSuccess);
}

/**
 * This method will give an array of Journal objects according to the params given as parameter.
 * For now, only a subset of the possible parameters is supported.
 * @config {string} id - The Journal's id
 * @config {number} rank - The Journal's rank
 * @public
 */
DBManager.prototype.getJournal = function(params, next) {
    var manager = this;
    //will be called once we got all disciplines from database
    var nextDisciplines = function(disciplines) {
        var onSuccess = function(res) {
            var jourObj = {};
            var jourArr = [];
            var discObj = {};
            for(var i = 0; i < disciplines.length; i++) {
                discObj[disciplines[i].id] = disciplines[i];
            }
            res.on('row', function(row) {
                //create journal once
                if(typeof jourObj[row.id] === 'undefined') {
                    var jour = new Journal(row.name, row.rank, []);
                    jour.id = row.id;
                    jourObj[row.id] = jour;

                    jourArr.push(jourObj[row.id]);
                }
                jourObj[row.id].disciplines.push(discObj[row.academic_discipline_id]);
            })
            .on('end', function(info) {
                //callback
                next(jourArr);
            });
        }
        var query = 'SELECT * FROM journal INNER JOIN journal_has_academic_discipline ' +
                    'ON journal.id = journal_has_academic_discipline.journal_id ' +
                    linker.queryOptions(params, linker.journalRepr);
        manager.executeQuery(query, params, onSuccess);
    }
    //first get disciplines
    this.getDiscipline({}, nextDisciplines);

};

/*
 * This method will update an existing journal in the database with the given Journal object.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * The callback has one parameter : an array of returned Journal objects.
 * @param {Journal} journal - The Journal that will be updated.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.putJournal = function(journal, next) {
    throw 'not yet implemented : putJournal';
}

/**
 * Adds a new non-existing Journal to the database.
 * @param {object} jsonObj - The Journal that will be added.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.postJournal = function(jsonObj, next) {
    this.postAlbum(jsonObj, next, 'journal', 'journal_has_academic_discipline');
}

/**
 * Delete an existing Journal from the database.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * @param {Journal} journal - The Journal that will be deleted.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.deleteJournal = function(journal, next) {
    throw 'not yet implemented : deleteJournal';
}

/**
 * This method will give an array of Proceeding objects according to the params given as parameter.
 * For now, only a subset of the possible parameters is supported.
 * @config {string} id - The Proceeding's id
 * @config {number} rank - The Proceeding's rank
 * @public
 */
DBManager.prototype.getProceeding = function(params, next) {
    throw 'not yet implemented : getProceeding';
}

/*
 * This method will update an existing proceeding in the database with the given Proceeding object.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * The callback has one parameter : an array of returned Proceeding objects.
 * @param {Proceeding} proceeding - The Proceeding that will be updated.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.putProceeding = function(proceeding, next) {
    throw 'not yet implemented : putProceeding';
}

/**
 * Adds a new non-existing Proceeding to the database.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * @param {Proceeding} proceeding - The Proceeding that will be added.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.postProceeding = function(proceeding, next) {
    this.postAlbum(jsonObj, next, 'conference', 'conference_has_academic_discipline');
}

/**
 * Delete an existing Proceeding from the database.
 * Because queries are asynchronous, a callback is needed for when the query finished.
 * @param {Proceeding} journal - The Proceeding that will be deleted.
 * @param {function} next - The callback that will be executed at the end of the query.
 * @public
 */
DBManager.prototype.deleteProceeding = function(proceeding, next) {
    throw 'not yet implemented : deleteProceeding';
}

/**
 * Posts a publication into the database and links the ID's of the authors and the keywords
 * in the database to the ID of the publication.
 *
 * @method
 * @param {object} publication This is the object that contains all information of the publication.
 */
DBManager.prototype.postPublication = function(jsonObj, next){
    var dbManager = this;
    //initial query to insert publication in database
    var query = 'INSERT INTO publication (publication_type, title, ' +
                                          'publication_title, nr_of_pages, ' +
                                          'published_in_year, url, published_by_user_id, ' +
                                          'summary_text) ' +
                                          'VALUES (:publication_type , :title ,'
                                               + ' :publication_title , :nr_of_pages ,'
                                               + ' :published_in_year , :url ,'
                                               + ' :published_by_user_id , :summary_text)';
    var queryParams = {publication_type: jsonObj.type, title: jsonObj.title,
                      publication_title: 'DUMMY', nr_of_pages: jsonObj.numberOfPages,
                      published_in_year: jsonObj.year, url: jsonObj.url,
                      published_by_user_id: 121, summary_text: 'TEST_SUMMARY'};
    //called if initial query succeeded
    var onSuccess = function(res) {
        res.on('end', function(info) {
            var id = info.insertId;
            var q = '';
            var qp = {publication_id: id};
            //make a list of queries to add authors and keywords
            for(var i = 0; i < jsonObj.authors.length; i++) {
                q += 'INSERT INTO publication_written_by_person ' +
                      'VALUES (:publication_id , :person_id_' + i + ');';
                qp['person_id_' + i] = jsonObj.authors[i].id;
            }
            for(var i = 0; i < jsonObj.keywords.length; i++) {
                q += 'INSERT INTO publication_has_keyword ' +
                     'VALUES (:publication_id , :keyword_' + i + ');';
                qp['keyword__' + i] = jsonObj.keywords[i].id;
            }

            var onEnd = function() {
                next(id);
            };
            dbManager.executeQuery(q, qp, undefined, undefined, onEnd);
        });
    };
    this.executeQuery(query, queryParams, onSuccess);
};

/**
 * This posts a journal publication into the database. Because the journal publication
 * is a subclass of publication it first post itself as a publication in the database
 * and then it fils in the extra jounal_publication. It is linked by ID to the publication in
 * the database.
 *
 * @method
 * @param {object} jsonObj - It contains an object which contains all data of a journalPublication.
 * @param {function} next - The callback that will be executed at the end of the query.
 */
DBManager.prototype.postJournalPublication = function(jsonObj, next){
    var dbManager = this;
    var postPublicationNext = function(id) {
        var query = 'INSERT INTO journal_publication VALUES (:id, :appeared_in_nr , :appeared_in_volume_nr , :part_of_journal_id)';
        var queryParams = {id: id, appeared_in_nr: jsonObj.number, appeared_in_volume_nr: jsonObj.volume, part_of_journal_id: jsonObj.journalId };
        var onEnd = function() {
            next(id);
        };
        dbManager.executeQuery(query, queryParams, undefined, undefined, onEnd);
    };
    this.postPublication(jsonObj, postPublicationNext);
};

/**
* This posts a proceeding publication into the database. Because the proceeding publication
* is a subclass of publication it first post itself as a publication in the database
* and then it fils in the extra proceeding_publication. It is linked by ID to the publication in
* the database.
*
* @method
* @param {object} jsonObj - It contains an object which contains all data of a proceedingPublication.
*/
DBManager.prototype.postProceedingPublication = function(jsonObj, next) {
    var dbManager = this;
    var postPublicationNext = function(id) {
        var query = 'INSERT INTO proceeding_publication VALUES (:held_in_city_name , :published_by_person , :part_of_conference_id)';
        var queryParams = {id: id, held_in_city_name: jsonObj.city,
                           published_by_person: jsonObj.publisher, part_of_conference_id: jsonObj.conferenceID };
        var onEnd = function() {
            next(id);
        };
        dbManager.executeQuery(query, queryParams, undefined, undefined, onEnd);
    };
    this.postPublication(jsonObj, postPublicationNext);
}

//The worst place to put this function
String.prototype.toUnderscore = function(){
    return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

/**
 * This method will give an array of Person objects according to the params given as parameter.
 * @param  {object}   params Set of parameters to search for in the database
 * @param  {Function} next   Wat to do with the result.
 */
DBManager.prototype.getPerson = function(params, next) {
    var onSuccess = function(res) {
        var people = [];
        res.on('row',function (row) {
            people.push({id:row.id, firstName:row.first_name, lastName:row.last_name});
        })
        .on('end', function() {
            next(people);
        })
    };
    var query = 'SELECT * FROM person ' + linker.queryOptions(params, linker.personRepr);
    this.executeQuery(query, params, onSuccess);
};

DBManager.prototype.getUser = function(params, next) {
    //TODO: omzetten van camelCase naar snake_case
    var userQuery = dbscheme.user.select(dbscheme.user.star())
                                 .from(dscheme.user)
                                 .where(params)
                                 .toQuery();
    var onUserSuccess = function(res) {
        var resultUsers = [];
        for (var u in res) {
            var onPersonSuccess = function(res) {
                if (res.length != 1) {
                    //Give an error, every user should have exactly one person
                    return;
                }
                u['person'] = new Person(res[0]);
                resultUsers.push(new User(u));
            }
            this.getPerson({'id': u.person_id}, onPersonSuccess);
        }
        next(resultUsers);
    }
    this.executeQuery(userQuery.text, userQuery.values, onUserSuccess);
}

DBManager.prototype.postPerson = function(jsonObj, next) {
    var query = dbscheme.person.insert(dbscheme.person.first_name.value(jsonObj.firstName), 
                                       dbscheme.person.last_name.value(jsonObj.lastName))
                               .toQuery();
    var onSuccess = function(res) {
        res.on('end', function(info) {
            next(info.insertId);
        });
    };
    this.executeQuery(query.text, query.values, onSuccess);
};

DBManager.prototype.postUser = function(jsonObj, next) {
    var dbManager = this;
    var afterPersonId = function(personId) {
        var query = dbscheme.user.insert(dbscheme.user.person_id.value(personId), 
                                         dbscheme.user.email_address.value(jsonObj.emailAddress), 
                                         dbscheme.user.password.value(jsonObj.password), 
                                         dbscheme.user.part_of_affiliation_id.value(1)) //1 is the id for VUB
                                 .toQuery();
        var onSuccess = function(res) {
            res.on('end', function(info) {
                next(info.insertId);
            });
        };
        dbManager.executeQuery(query.text, query.values, onSuccess);
    }
    if (jsonObj.personId) {
        afterPersonId(jsonObj.personId);
    } else {
        this.postPerson(jsonObj, afterPersonId);
    }
}
//Exports
module.exports = DBManager;
