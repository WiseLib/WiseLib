'use strict';
var Album = require('./album.js');

/**
 * A Proceeding is collection of publications used during a conference.
 * It is a subclass of Album.
 * @constructor
 * @extends Album
 */
var Proceeding = Album;
Proceeding.prototype = new Album();
Proceeding.prototype.constructor = Proceeding;

//exports
module.exports = Proceeding;