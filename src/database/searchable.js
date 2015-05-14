'use strict';
var Promise = require('bluebird');
var Writeable = require('./writeable.js');
var DBManager = require('./dbmanager.js');

/* Allow searching in database (using the 'q' variable)
 * @superclass Writeable
 */
var Searchable = function(arg) {
	Writeable.call(this, arg);
	this.removeInvalidTags();
};

Searchable.prototype = Object.create(Writeable.prototype);
Searchable.prototype.searchKey = 'q';
Searchable.prototype.variables = [Searchable.prototype.searchKey];
Searchable.prototype.variables.push.apply(Searchable.prototype.variables, Writeable.prototype.variables);
Searchable.prototype.tagCharacter = '@';

/**
 * It is possible to search on specific variables only, by using tags.
 * This method removes invalid tags from the search variable.
 * If all tags are invalid, it removes the search variable.
 * A filter can optionally be specified, tags not specified in the filter will then be removed.
 * @param  {Array<String>} filter : An optional Array containing variables
 * @return {void}
 */
Searchable.prototype.removeInvalidTags = function(filter) {
	if(!filter) {
		filter = this.variables;
	}
	if(this.q) {
		var tags = this.q.split(this.tagCharacter);
		var validQ = tags[0];
		tags.shift();
		//remove q if there are tags and all tags are invalid
		var remove = tags.length > 0;
		for(var i in tags) {
			var valid = filter.indexOf(tags[i]) > -1;
			remove = remove && !valid;
			if(valid) {
				validQ = validQ.concat(this.tagCharacter + tags[i]);
			}
		}
		if(remove) {
			validQ = undefined
		}
		this.q = validQ;
	}
};
Searchable.prototype.constructor = Searchable;

module.exports = Searchable;