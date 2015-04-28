'use strict';
var SearchAble = require('../database/searchable.js');
var UserRepr = require('../database/linker.js').userRepr;

var User = function(arg) {
	SearchAble.call(this, arg);
};

User.prototype = Object.create(SearchAble.prototype);
User.prototype.variables = ['email', 'password', 'person', 'library'];
User.prototype.variables.push.apply(User.prototype.variables, SearchAble.prototype.variables);
User.prototype.representation = UserRepr;
User.prototype.constructor = User;

module.exports = User;