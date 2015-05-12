'use strict';
var Promise = require('bluebird');
var Publication = require('./publication.js');
var DBManager = require('../database/dbmanager.js');

/* A publication that is pubished in a Journal
 * the 'type' is always 'Journal'
 * @superclass Publication
 * @constructor
 */
var SpecializedPublication = function(arg) {
	Publication.call(this, arg);
};

SpecializedPublication.prototype = Object.create(Publication.prototype);

/**
 * [fetch description]
 * @return {[type]} [description]
 */
SpecializedPublication.prototype.fetch = function() {
	var specializedPublication = this;
	var promise = Publication.prototype.fetch.call(this);
	return promise.then(function(publication) {
		return DBManager.get(publication);
	})
	.then(function(res) {
		specializedPublication.assignVariables(res[0]);
		return specializedPublication;
	});
};

/**
 * [fetchAll description]
 * @return {[type]} [description]
 */
SpecializedPublication.prototype.fetchAll = function() {
	var sp = this;
	//db will only search on Representation.relationSearch and Representation[searchKey]
	var publication = new Publication(sp);
	var specializedPublication = new sp.constructor(sp);
	var filter = sp.representation[sp.searchKey]
	.concat(sp.representation.relationSearch);
	//make sure no other tags are specified
	specializedPublication.removeInvalidTags(filter);
	var common = publication.hasVariables(['type', publication.searchKey]) ||
	             specializedPublication.hasVariables(['type', specializedPublication.searchKey]);
	var all = publication.q && specializedPublication.q;
	var dbp = DBManager.get(publication);
	var dbsp = DBManager.get(specializedPublication);
	return Promise.all([dbp, dbsp])
	.then(function(types) {
		var results = {};
		var publications = [];
		types[0].forEach(function(publication) {
			results[publication.id] = publication;
		});
		types[1].forEach(function(publication) {
			var p = results[publication.id];
			results[publication.id] = undefined;
			//if results were found in both lists, add them to results
			if(p) {
				var pub = new sp.constructor(p);
				pub.assignVariables(publication);
				publications.push(pub);
			}
			//if results were only found in second list, only add them if :
			//* there were no filters in the fetch
			//* both lists had a valid search variable
			else if(!common && all) {
				publications.push(new Publication(publication.id).fetch()
				.then(function(instance) {
					var pub = new sp.constructor(instance);
					pub.assignVariables(publication);
					return pub;
				}));
			}
		});
		//add results found only in first list, if same conditions are true as previous comment
		if(!common && all) {
			Object.keys(results).forEach(function(id) {
				publications.push(new sp.constructor(id).fetch());
			});
		}
		return Promise.all(publications);
	});
};

SpecializedPublication.prototype.save = function() {
	var specializedPublication = this;
	var save = specializedPublication.id ? DBManager.put : DBManager.post;
	return Publication.prototype.save.call(specializedPublication)
	.then(function(publication) {
		return save(specializedPublication);
	})
	.then(function() {
		return specializedPublication;
	});
};
SpecializedPublication.prototype.destroy = function() {
	var specializedPublication = this;
	//need to hold on the ID
	var id = specializedPublication.id;
	return specializedPublication.destroyWithRepresentation(specializedPublication.representation)
	.then(function() {
		specializedPublication.assignVariables({id:id});
		return Publication.prototype.destroy.call(specializedPublication);
	});
};
SpecializedPublication.prototype.constructor = SpecializedPublication;

module.exports = SpecializedPublication;