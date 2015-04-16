'use strict';
var linker = require('./linker.js');
var _ = require('lodash');
var Promise = require('bluebird');
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
var DBManager = function() {};

DBManager.prototype.post = function(jsonObj, classObj, next) {
    var dbManager = this;
    var postSubclass = function(superId) {
        if(superId !== undefined) {
            jsonObj[classObj.id.name] = superId;
        }
        var toPost = classObj.toModel(jsonObj);
        toPost.save({}, {method: 'insert'}).then(function(model) {
            jsonObj[classObj.id.name] = model.id;
            dbManager.put(jsonObj, classObj, next);
        });
    };
    if(classObj.super !== undefined) {
        this.post(jsonObj, classObj.super, postSubclass);
    }
    else {
        postSubclass();
    }

};

DBManager.prototype.get = function(jsonObj, classObj, next) {
    //fetch all based on given attributes (such as title, year, id)/relations (authors, parent)
    if(classObj.super !== undefined) {
        classObj.super.toQuery(jsonObj).fetchAll({withRelated: classObj.super.relations}).then(function(results) {
            var queries = [];
            var parsed = [];
            for(var res in results.models) {
                var id = {};
                id[classObj.id.fieldName] = results.models[res].id;
                queries.push(classObj.model.where(id).fetch({withRelated: classObj.relations}).then(function(sub) {
                    if(sub !== null) {
                        var sup = classObj.super.parse(results.get(sub.id).toJSON());
                        var par = classObj.parse(sub.toJSON());
                        parsed.push(_.merge(sup, par));
                    }
                }));
            }
            Promise.all(queries).then(function() {
                next(parsed);
            });
        });
    }
    else {
        classObj.toQuery(jsonObj).fetchAll({withRelated: classObj.relations}).then(function(results) {
            var parsed = _.map(results.models, function(model) {
                return classObj.parse(model.toJSON());
            });
            next(parsed);
        });
    }
};

//id is required, maybe check in event 'updating' (see bookshelf.js)
DBManager.prototype.put = function(jsonObj, classObj, next) {
    var dbManager = this;
    var toSave = classObj.toModel(jsonObj);
    toSave.save({}, {method: 'update'}).then(function(model) {
        if(classObj.super !== undefined) {
            dbManager.put(jsonObj, classObj.super, next);
        }
        else {
            var convertedResult = classObj.parse(model.toJSON());
            next(convertedResult.id);
        }
    });
};

//id is required, maybe check in event 'destroying' (see bookshelf.js)
DBManager.prototype.delete = function(jsonObj, classObj, next) {
    var dbManager = this;
    var toDelete = classObj.toModel(jsonObj);
    toDelete.destroy().then(function(model) {
        if(classObj.super !== undefined) {
            dbManager.delete(jsonObj, classObj.super, next);
        }
        else {
            next(model);
        }
    });
};

/**
 * Posts a publication into the database and links the ID's of the authors and the keywords
 * in the database to the ID of the publication.
 *
 * @method
 * @param {object} publication This is the object that contains all information of the publication.
 */
DBManager.prototype.postPublication = function(jsonObj, next){
    this.post(jsonObj, linker.publicationRepr, next);
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
    this.post(jsonObj, linker.publicationRepr, function(id) {
        jsonObj.id = id;
        dbManager.post(jsonObj, linker.journalPublicationRepr, next);
    });
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
    this.post(jsonObj, linker.publicationRepr, function(id) {
        jsonObj.id = id;
        dbManager.post(jsonObj, linker.proceedingPublicationRepr, next);
    });
};

//Exports
var singleton = new DBManager();
module.exports = singleton;
