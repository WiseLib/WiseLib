'use strict';
var _ = require('lodash');
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

 DBManager.prototype.post = function(writeable, repr) {
    var representation;
    if(repr) {
        representation = repr;
    }
    else {
        representation = writeable.representation;
    }
    var toPost = representation.toModel(writeable);
    return toPost.save({}, {method: 'insert'}).then(function(model) {
        return model.id;
    });
};

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
