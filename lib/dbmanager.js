'use strict';
var Client = require('mariasql');
var linker = require('./linker.js');
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
    query = client.query(query, queryParams);
    var result = query.on('result', onSuccess)
        .on('error', onError).on('end', onEnd);

    client.end();

    return result;
};

DBManager.prototype.post = function(jsonObj, classObj, next) {
    var dbManager = this;
    var insert = linker.queryInsert(jsonObj, classObj);
    var insertQueries = insert[0];
    var insertOptions = insert[1];
    //first query to be executed
    var query = insertQueries[0];
    //if first query is a success, execute this function
    var onSuccess = function(res) {
        res.on('end', function(info) {
            //get id of inserted object
            var id = info.insertId;

            console.log('updated id : ' + id);
            var q = ' ';
            insertOptions.id = id;
            //make a list of queries to add foreign objects
            for(var i = 1; i < insertQueries.length; i++) {
                q  += insertQueries[i] + ';';
            }
            //when list of queries finished : execute this function
            var onEnd = function() {
                next(id);
            };
            //console.log('queries : ' + q);
            //remove the ';' from the last query
            dbManager.executeQuery(q.substring(0, q.length-1), insertOptions, undefined, undefined, onEnd);
        });
    };
    this.executeQuery(query, insertOptions, onSuccess);
};

DBManager.prototype.getIter = function(queries, options, classObj, previous, next) {
    var manager = this;
    var results = previous[classObj.reprTables[0]];
    var resArray = [];
    var nextIteration = [];
    for(var i = 1; i < classObj.reprGet.length; i++) {
        nextIteration.push({});
    }
    var reprGet = classObj.reprGet;
    //console.log(queries);
    //will be called when query was successfully executed
    var onSuccess = function(res) {
        //on each row :
        //if an instance of the corresponding object was not created : create it
        //else add id from foreign table to instance
        //make query to get object of id from foreign table
        //example : journal with id=5, name=test, rank=1, disciplines=[2,3] will have two rows :
        // 5, test, 1, 2 AND 5, test, 1, 3.
        //A journal will be made, 2 and 3 added as its disciplines, and queries to fetch objects for 2 and 3
        res.on('row', function(row) {
            var objId = row[reprGet[0].fieldName];
            //no object created
            if(results[objId] === undefined) {
                //make new instance
                results[objId] = classObj.reprNew(row);
                resArray.push(results[objId]);
            }
            for(var i = 1; i < reprGet.length; i++) {
                var currField = reprGet[i];
                if(previous[currField.repr.reprTables[0]] === undefined) {
                    previous[currField.repr.reprTables[0]] = {};
                }
                //foreign key
                var toAdd = row[currField.foreign.fieldName];
                if(toAdd !== null) {
                    //add foreign key
                    if(currField.foreign.multiple) {
                        results[objId][currField.foreign.name].push(toAdd);
                    }
                    else {
                        results[objId][currField.foreign.name] = toAdd;
                    }
                    //query to fetch object of foreign key
                    var q = 'SELECT * FROM ' + currField.id.table;
                    q += ' WHERE ' + currField.id.fieldName + ' = ' + toAdd + ';';
                    //add query
                    nextIteration[i-1][toAdd] = q;
                }
            }
        });
    };
    //will be called at the end of queries
    var onEnd = function() {
        var nextQueries = [];
        //queries whose objects were already fetched in previous iterations
        var alreadyObj = [];
        for(var i = 0; i < nextIteration.length; i++) {
            var nextQuery = '';
            alreadyObj.push([]);
            //one composite query to get all foreign objects
            for(var toAdd in nextIteration[i]) {
                //see if there is no object with id of future query
                var fr = previous[reprGet[i+1].repr.reprTables[0]];
                if(fr[toAdd] === undefined) {
                    nextQuery += nextIteration[i][toAdd];
                }
                else {
                    alreadyObj[i].push(fr[toAdd]);
                }
            }
            nextQueries.push(nextQuery);
        }
        //console.log('next queries : ' + nextQueries);
        //console.log('already obj : ' + alreadyObj);
        //r: array of foreign objects
        //replace foreign id's with their corresponding object
        var idToObj = function(r, index) {
            var nextIterRes = {};
            //reference objects by their id
            for(var i = 0; i < r.length; i++) {
                nextIterRes[r[i][reprGet[index].id.fieldName]] = r[i];
            }
            //only replace if there are objects to replace with
            if(r.length > 0) {
                //replace each foreign id with its foreign object
                for(i = 0; i < resArray.length; i++) {
                    var replace = resArray[i][reprGet[index].foreign.name];
                    if(reprGet[index].foreign.multiple) {
                        for(var j = 0; j < replace.length; j++) {
                            if(nextIterRes[replace[j]] !== undefined) {
                                replace[j] = nextIterRes[replace[j]];
                            }
                        }
                    }
                    else if(nextIterRes[replace] !== undefined) {
                        resArray[i][reprGet[index].foreign.name] = nextIterRes[replace];
                    }
                }
            }
        };
        var queriesLeft = false;
        for(i = 0; i < alreadyObj.length; i++) {
            idToObj(alreadyObj[i], i+1);
            //will be executed once foreign objects are created
            //r: array of foreign objects
            var after = function(r) {
                idToObj(r, i);
                next(resArray);
            };
            if(nextQueries[i] !== '') {
                if(!queriesLeft) {
                    manager.getIter(nextQueries[i], undefined, reprGet[i+1].repr, previous, after);
                }
                else {
                    var a = function(r) {
                        idToObj(r, i);
                    };
                    manager.getIter(nextQueries[i], undefined, reprGet[i+1].repr, previous, a);
                }
                queriesLeft = true;
            }
        }
        //if there are no foreign objects to fetch
        if(!queriesLeft)  {
            next(resArray);
        }
    };
    this.executeQuery(queries, options, onSuccess, undefined, onEnd);
};

DBManager.prototype.get = function(jsonObj, classObj, next) {
    //var p = {title: 'test', numberOfPages: 23, year: 2014, url:'http://example2.com', abstract: '', uploader:172, authors:[{id:9050},{id:9052}]};
    //var ins = linker.queryInsert(p, linker.publicationRepr);
    //console.log('INSERT query : ' + ins[0]);
    //console.log('INSERT options : ' + JSON.stringify(ins[1]));
    //this.post(p, linker.publicationRepr, function(id) {console.log('added publication with id ' + id)});
    var query = linker.queryGet(jsonObj, classObj);
    var previous = {};
    previous[classObj.reprTables[0]] = {};
    this.getIter(query, jsonObj, classObj, previous, next);
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
                                          'VALUES (:publication_type , :title ,' +
                                               ' :publication_title , :nr_of_pages ,' +
                                               ' :published_in_year , :url ,' +
                                               ' :published_by_user_id , :summary_text)';
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
            if(typeof jsonObj.keywords !== 'undefined') {
                for(i = 0; i < jsonObj.keywords.length; i++) {
                    q += 'INSERT INTO publication_has_keyword ' +
                         'VALUES (:publication_id , :keyword_' + i + ');';
                    qp['keyword__' + i] = jsonObj.keywords[i].id;
                }
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
};

//Exports
module.exports = DBManager;