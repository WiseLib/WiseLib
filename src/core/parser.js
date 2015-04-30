'use strict';
/* Parse a file and extract meaningfull data from it
 * @param arg (string) filepath
 * @param arg (object) file
 * @throws TypeError wrong argument
 * @abstract, @constructor
 */
var Parser = function(arg) {
	if(typeof(arg) === 'string') {
		this.path = arg;
	}
	else if(typeof(arg) === 'object') {
		if(this.isSupported(arg.mimetype)) {
			this.path = arg.path;
		}
		else {
			throw new TypeError('invalid argument : ' + arg.mimetype + ' is not supported');
		}
	}
	else {
		throw new TypeError('invalid argument : ' + arg + ' is a ' + typeof(arg));
	}
};
/* returns if a filetype is supported or not
 * @param mimetype(string) the asked type
 * @return boolean
 * @abstract, @public
 */
Parser.prototype.isSupported = function(mimetype) {
	return false;
};
/* extract meaningfull data from file
 * @return Promise<Object> a promise containing an object with extracted data
 * @abstract, @public, @static
 */
Parser.prototype.extract = function() {
	throw new Error('not implemented');
};

module.exports = Parser;