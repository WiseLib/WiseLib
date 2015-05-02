'use strict';
var Promise = require('bluebird');
var Writeable = require('./writeable.js');
var DBManager = require('./dbmanager.js');

/* Allow searching in database (using the 'q' variable)
 * @superclass Writeable
 */
var Searchable = function(arg) {
	Writeable.call(this, arg);
};

Searchable.prototype = Object.create(Writeable.prototype);
Searchable.prototype.variables = ['q'];
Searchable.prototype.variables.push.apply(Searchable.prototype.variables, Writeable.prototype.variables);
Searchable.prototype.constructor = Searchable;

module.exports = Searchable;