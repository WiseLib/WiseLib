'use strict';
var _ = require('lodash');

/**
 * The DBManager is responsible for communicating with the database.
 * It provides post, get, put, and delete methods to respectively
 * add, get, update and remove Writables from the database.
 * It is a singleton
 * @constructor
 */
 var DBManager = function() {};

 /**
  * Post a Writable in the database, its id must be undefined, or not already in the database.
  * @param {Writable} writable : The Writable instance to post
  * @param {Representation} repr : an optional representation that will be used instead of the Writable one
  * @return {Promise<Writable>} the updated writable
  */
 DBManager.prototype.post = function(writeable, repr) {
    var representation;
    if(repr) {
        representation = repr;
    }
    else {
        representation = writeable.representation;
    }
    var toPost = representation.toModel(writeable);
    return toPost.save({}, {method: 'insert'})
    .then(function(model) {
        writeable.id = model.id;
        return DBManager.prototype.put(writeable, repr);
    });
};

/**
  * Get all Searchables from the database that correspond to the given Searchable
  * @param {Searchable} writable : The Searchable instance that is used to get
  * @param {Representation} repr : an optional representation that will be used instead of the Searchable one
  * @return {Promise<Array<Searchable>>} all Searchables matching the given Searchable
  */
DBManager.prototype.get = function(searchable, repr) {
    var representation;
    if(repr) {
        representation = repr;
    }
    else {
        representation = searchable.representation;
    }
    return representation.toQuery(searchable).fetchAll({withRelated: representation.relations})
    .then(function(results) {
        var parsed = _.map(results.models, function(model) {
            return representation.parse(model.toJSON());
        });
        return parsed;
    });
};

/**
  * Update a Writable
  * @required id : the Writable's id
  * @param {Writable} writable : The Writable instance to update
  * @param {Representation} repr : an optional representation that will be used instead of the Writable one
  * @return {Promise<Writable>} the updated writable
  */
//id is required, maybe check in event 'updating' (see bookshelf.js)
DBManager.prototype.put = function(writeable, repr) {
    var representation;
    if(repr) {
        representation = repr;
    }
    else {
        representation = writeable.representation;
    }
    var toSave = representation.toModel(writeable);
    return toSave.save({}, {method: 'update'}).then(function(model) {
        return model.id;
    });
};

/**
  * Removes a Writable from the database
  * @required id : the Writable's id
  * @param {Writable} writable : The Writable instance to delete
  * @param {Representation} repr : an optional representation that will be used instead of the Writable one
  * @return {Promise<void>}
  */
//id is required, maybe check in event 'destroying' (see bookshelf.js)
DBManager.prototype.delete = function(writeable, repr) {
    var representation;
    if(repr) {
        representation = repr;
    }
    else {
        representation = writeable.representation;
    }
    var toDelete = representation.toModel(writeable);
    return toDelete.destroy().then(function() {
        return;
    });
};

//Exports
var singleton = new DBManager();
module.exports = singleton;
