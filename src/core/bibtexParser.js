'use strict';
var Parser = require('./parser.js');

var BibtexParser = function(path) {
	Parser.call(this, path);
};

BibtexParser.prototype = Object.create(Parser.prototype);
BibtexParser.prototype.extract = function() {

};
BibtexParser.prototype.isSupported = function(mimetype) {
	return mimetype === 'text/x-bibtex';
};
BibtexParser.prototype.constructor = BibtexParser;

module.exports = BibtexParser;