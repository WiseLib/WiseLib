'use strict';
var Searchable = require('../database/searchable.js');
var UserRepr = require('../database/linker.js').userRepr;
var crypto = require('crypto');

/* a user with an account on Wiselib.
 * 'email' must be unique
 * @superclass Searchable
 * @constructor
 */
var User = function(arg) {
	Searchable.call(this, arg);
};

User.prototype = Object.create(Searchable.prototype);
User.prototype.variables = ['email', 'password', 'person', 'library'];
User.prototype.variables.push.apply(User.prototype.variables, Searchable.prototype.variables);
User.prototype.representation = UserRepr;
User.prototype.constructor = User;

User.prototype.save = function(){

	if (this.password !== undefined){
		var hash = crypto.createHash('sha1');
		var password = this.password;
		var hashedPassword = hash.update(password).digest('hex');
		this.password=hashedPassword;
	}
	return this.saveWithRepresentation(this.representation);
};

module.exports = User;