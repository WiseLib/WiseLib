'use strict';
var Album = require('./album.js');

/**
 * A Journal is a periodical album.
 * It is a subclass of Album.
 * @constructor
 * @extends Album
 */
var Journal = Album;
Journal.prototype = new Album();
Journal.prototype.constructor = Journal;

//exports
module.exports = Journal;