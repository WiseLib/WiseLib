'use strict';

var Parser = function(arg) {
	if(typeof(arg) === 'string') {
		this.path = arg;
	}
	else if(typeof(arg) === 'object') {
		var file = arg.files.file;
		this.path = file.path;
	}
	else {
		throw new TypeError('invalid argument : ' + arg);
	}
};

Parser.prototype.isSupported = function(mimetype) {
	return false;
};

Parser.prototype.extract = function() {
	throw new Error('not implemented');
};

module.exports = Parser;