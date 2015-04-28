'use strict';
var Promise = require('bluebird');
var DBManager = require('./dbmanager.js');

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

WriteAble.prototype.variables = ['id'];
/*
Need to overwrite
*/
WriteAble.prototype.representation = undefined;
WriteAble.prototype.assignVariables = function (vars) {
    for (var v in this.variables) {
    	var assign = vars[this.variables[v]];
    	if(assign) {
    		this[this.variables[v]] = assign;
    	}
    }
};
WriteAble.prototype.initJSON = function(json) {
	this.assignVariables(json);
};
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
WriteAble.prototype.save = function() {
	return this.saveWithRepresentation(this.representation);
};
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
WriteAble.prototype.destroy = function() {
	return this.destroyWithRepresentation(this.representation);
};
module.exports = WriteAble;