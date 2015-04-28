'use strict';
var Album = require('./album.js');
var ProceedingRepr = require('../database/linker.js').proceedingRepr;

var Proceeding = function(arg) {
	Album.call(this, arg);
}

Proceeding.prototype = Object.create(Album.prototype);
Proceeding.prototype.representation = ProceedingRepr;
Proceeding.prototype.constructor = Proceeding;

module.exports = Proceeding;