'use strict';
var Promise = require('bluebird');
var DBManager = require('./dbmanager.js');

/* Writeable : provides interaction with database, must subclass this to communicate with it
 * (see fetch, fetchAll, save, destroy)
 * @params arg (number) : the id of the new Writeable
 * @params arg (string) : string with id of the new Writeable
 * @params arg (json) : contains initial values of Writeable variables (not necessarily all of them)
 * @throw TypeError argument is invalid
 * @abstract, @constructor
 */
var Writeable = function(arg) {
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
/* Supported variables of Writeable
 * @protected
 */
Writeable.prototype.variables = ['id'];
/* Database Representation of Writeable
 * @abstract, @protected
 */
Writeable.prototype.representation = undefined;
/* Assign given values to variables
 * @param vars (json) contains variables with values to set
 * @protected
 */
Writeable.prototype.assignVariables = function (vars) {
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
Writeable.prototype.initJSON = function(json) {
	this.assignVariables(json);
};
/* fetch data from database, update this writeable accordingly
 * @required id
 * @return Promise<this> a Promise containing the updated writeable
 * @public
 */
Writeable.prototype.fetch = function() {
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
 * @return Promise<Array<Writeable>> a Promise containing an array with all writeables corresponding to this writable
 * @public
 */
Writeable.prototype.fetchAll = function() {
	var writeable = this;
	return DBManager.get(writeable)
	.then(function(res) {
		var writeables = [];
		res.forEach(function(item) {
			writeables.push(new writeable.constructor(item));
		});
		return writeables;
	});
};
/* save current writeable to database. Will put if already exist (id is given), otherwise, will post
 * @param representation (Representation) a custom representation that the DBManager will use
 * @return Promise<this> a Promise containing the updated writeable
 * @protected
 */
Writeable.prototype.saveWithRepresentation = function(representation) {
	var writeable = this;
	if(writeable.id) {
		return DBManager.put(writeable, representation)
		.then(function() {
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
Writeable.prototype.save = function() {
	return this.saveWithRepresentation(this.representation);
};
/* remove current writeable to database.
 * @required id
 * @param representation (Representation) a custom representation that the DBManager will use
 * @return Promise<this> a Promise containing the updated writeable
 * @protected
 */
Writeable.prototype.destroyWithRepresentation = function(representation) {
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
Writeable.prototype.destroy = function() {
	return this.destroyWithRepresentation(this.representation);
};
module.exports = Writeable;