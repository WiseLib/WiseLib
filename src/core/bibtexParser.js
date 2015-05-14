'use strict';
var Promise = require('bluebird');
var fs = require('fs')
var Parser = require('./parser.js');
var DBManager = require('../database/dbmanager.js')
var Publication = require('./publication.js');
var bibtexParse = require('bibtex-parse-js');

/**
 * BibtexParser: a class that is used to get the right information from a bibtexfile.
 * @superclass: parser
 * @constructor
 */

var BibtexParser = function(path) {
	Parser.call(this, path);
};

BibtexParser.prototype = Object.create(Parser.prototype);

BibtexParser.prototype.extract = function() {
	var promise = BibtexParser.prototype.getBibtexData(this)
		.then(function(res) {
			return BibtexParser.prototype.checkReferences(res);
		})
		.then(function(res) {
			return new Promise(function(resolve, reject) {
				resolve(res);
			});
		});
	return promise;
};

BibtexParser.prototype.isSupported = function(mimetype) {
	return mimetype === 'text/x-bibtex';
};

BibtexParser.prototype.getBibtexData = function(obj) {
	var promise = new Promise(function(resolve, reject) {
		fs.readFile(obj.path, 'utf8', function(err, data) {
			if (err) {
				reject(console.log(err));
			}
			var jsonObj = bibtexParse.toJSON(data);
			resolve(jsonObj);
		});
	});
	return promise
};

BibtexParser.prototype.makeSimplifiedReferences = function(references) {
	var simplifiedReferences = [];
	for (var r in references) {
		var title = references[r].entryTags.title || references[r].entryTags.Title || references[r].entryTags.TITLE;
		var authors = references[r].entryTags.author || references[r].entryTags.Author || references[r].entryTags.AUTHOR;
		var reference = {
			title: title,
			authors: authors
		};
		simplifiedReferences.push(reference);
	}
	return simplifiedReferences;
};

BibtexParser.prototype.checkReferences = function(references) {
	references = BibtexParser.prototype.makeSimplifiedReferences(references);
	var knownReferences = [];
	var unknownReferences = [];
	var promises = [];
	var ret;
	for (var i = 0; i < references.length; i++) {
		var reference = references[i];
		(function(reference) {
			var promise = DBManager.get({
				title: reference.title
			}, Publication.prototype.representation);
			var res = promise
				.then(function(res) {
					if (res.length === 1) {
						knownReferences.push(res[0]);
					} else {
						unknownReferences.push(reference);
					}
				})
				.catch(function(err) {
					console.log(err);
				});
			promises.push(res);
		})(reference);
	};

	return Promise.all(promises)
		.then(function() {
			var jsonObj = {
				references: knownReferences,
				unknownReferences: unknownReferences
			};
			return new Promise(function(resolve, reject) {
				resolve(jsonObj);
			});
		});
};

BibtexParser.prototype.constructor = BibtexParser;

module.exports = BibtexParser;