'use strict';
var Promise = require('bluebird');
var SearchAble = require('../database/searchable.js');
var UnknownPublicationRepr = require('../database/linker.js').unknownPublicationRepr;

var UnknownPublication = function(arg) {
    SearchAble.call(this, arg);
};

UnknownPublication.prototype = Object.create(SearchAble.prototype);
UnknownPublication.prototype.variables = ['reference', 'title', 'authors'];
UnknownPublication.prototype.representation = UnknownPublicationRepr;
UnknownPublication.prototype.variables.push.apply(UnknownPublication.prototype.variables, SearchAble.prototype.variables);
UnknownPublication.prototype.constructor = UnknownPublication;

module.exports = UnknownPublication;
