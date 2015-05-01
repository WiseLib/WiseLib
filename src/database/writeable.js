'use strict';
var Promise = require('bluebird');
var DBManager = require('./dbmanager.js');

/* WriteAble : provides interaction with database, must subclass this to communicate with it
 * (see fetch, fetchAll, save, destroy)
 * @params arg (number) : the id of the new WriteAble
 * @params arg (string) : string with id of the new WriteAble
 * @params arg (json) : contains initial values of WriteAble variables (not necessarily all of them)
 * @throw TypeError argument is invalid
 * @abstract, @constructor
 */
var WriteAble = function(arg) {
	if(typeof(arg) === 'number') {
		this.initJSON({id:arg});
	}
	else if(typeof(arg) === 'string') {
		var num = parseInt(arg);
		if(isNaN(num)) {
			throw new TypeError('invalid argument : ' + arg + ' is an invalid ' + typeof(arg));
		}
		this.initJSON({id:num});
	}
	else if(typeof(arg) === 'object') {
		this.initJSON(arg);
	}
	else {
		throw new TypeError('invalid argument : ' + arg + ' is a ' + typeof(arg));
	}
};
/* Supported variables of WriteAble
 * @protected
 */
WriteAble.prototype.variables = ['id'];
/* Database Representation of WriteAble
 * @abstract, @protected
 */
WriteAble.prototype.representation = undefined;
/* Assign given values to variables
 * @param vars (json) contains variables with values to set
 * @protected
 */
WriteAble.prototype.assignVariables = function (vars) {
    for (var v in this.variables) {
    	var assign = vars[this.variables[v]];
    	if(assign) {
    		this[this.variables[v]] = assign;
    	}
    }
};
/* initialize instance with json file
 * @param json (json) contains variables to initialize
 * @protected
 */
WriteAble.prototype.initJSON = function(json) {
	this.assignVariables(json);
};
/* fetch data from database, update this writeable accordingly
 * @required id
 * @return Promise<this> a Promise containing the updated writeable
 * @public
 */
WriteAble.prototype.fetch = function() {
	var writeable = this;
	if(!writeable.id) {
		return Promise.reject(writeable);
	}
	return DBManager.get(this)
	.then(function(res) {
		if(res.length > 0) {
			writeable.assignVariables(res[0]);
			return writeable;
		}
		else {
			Promise.reject(writeable.id);
		}
	});
};
/* fetch data from database, according to this writeable's variable values
 * @return Promise<Array<WriteAble>> a Promise containing an array with all writeables corresponding to this writable
 * @public
 */
WriteAble.prototype.fetchAll = function() {
	var writeable = this;
	return DBManager.get(writeable)
	.then(function(res) {
		var writeables = [];
		for(var i in res) {
			writeables.push(new writeable.constructor(res[i]));
		}
		return writeables;
	});
};
/* save current writeable to database. Will put if already exist (id is given), otherwise, will post
 * @param representation (Representation) a custom representation that the DBManager will use
 * @return Promise<this> a Promise containing the updated writeable
 * @protected
 */
WriteAble.prototype.saveWithRepresentation = function(representation) {
	var writeable = this;
	if(writeable.id) {
		return DBManager.put(writeable, representation)
		.then(function(id) {
			return writeable;
		});
	}
	else {
		return DBManager.post(writeable, representation)
		.then(function(id) {
			writeable.id = id;
			return writeable;
		});
	}
};
/* save current writeable to database. Will put if already exist (id is given), otherwise, will post
 * @return Promise<this> a Promise containing the updated writeable
 * @public
 */
WriteAble.prototype.save = function() {
	return this.saveWithRepresentation(this.representation);
};
/* remove current writeable to database.
 * @required id
 * @param representation (Representation) a custom representation that the DBManager will use
 * @return Promise<this> a Promise containing the updated writeable
 * @protected
 */
WriteAble.prototype.destroyWithRepresentation = function(representation) {
	var writeable = this;
	if(!writeable.id) {
		return Promise.reject(writeable.id);
	}
	else {
		return DBManager.delete(writeable, representation)
		.then(function() {
			writeable.id = undefined;
			return writeable;
		});
	}
};
/* remove current writeable to database.
 * @required id
 * @return Promise<this> a Promise containing the updated writeable
 * @public
 */
WriteAble.prototype.destroy = function() {
	return this.destroyWithRepresentation(this.representation);
};
module.exports = WriteAble;