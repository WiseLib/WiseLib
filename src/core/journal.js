'use strict';
var Album = require('./album.js');
var JournalRepr = require('../database/linker.js').journalRepr;
/* a Journal publishing publications
 * @superclass Album
 * @constructor
 */
var Journal = function(arg) {
	Album.call(this, arg);
}

Journal.prototype = Object.create(Album.prototype);
Journal.prototype.representation = JournalRepr;
Journal.prototype.constructor = Journal;

module.exports = Journal;