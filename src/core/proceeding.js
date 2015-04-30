'use strict';
var Album = require('./album.js');
var ProceedingRepr = require('../database/linker.js').proceedingRepr;

/* A collection of publications that are talked about during a conference
 * @superclass Album
 * @constructor
 */
var Proceeding = function(arg) {
	Album.call(this, arg);
}

Proceeding.prototype = Object.create(Album.prototype);
Proceeding.prototype.representation = ProceedingRepr;
Proceeding.prototype.constructor = Proceeding;

module.exports = Proceeding;