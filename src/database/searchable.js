'use strict';
var Promise = require('bluebird');
var WriteAble = require('./writeable.js');
var DBManager = require('./dbmanager.js');

/* Allow searching in database (using the 'q' variable)
 * @superclass WriteAble
 */
var SearchAble = function(arg) {
	WriteAble.call(this, arg);
};

SearchAble.prototype = Object.create(WriteAble.prototype);
SearchAble.prototype.variables = ['q'];
SearchAble.prototype.variables.push.apply(SearchAble.prototype.variables, WriteAble.prototype.variables);
SearchAble.prototype.constructor = SearchAble;

module.exports = SearchAble;