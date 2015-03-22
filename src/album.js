'use strict';
/**
 * An album is a collection of publications.
 * An album's collection only contains publications for a specific set of disciplines.
 * and has a rank (the higher the rank, the better).
 * @param {string} id - The album's name
 * @param {number} rank - The album's rank
 * @param {array} [disciplines] - The disciplines of this album.
 * @constructor
 */
var Album = function(name, rank, disciplines) {
    this.id = null;
    this.name = name;
    this.rank = rank;
    this.disciplines = [];
    if(typeof disciplines !== 'undefined') {
        this.disciplines = disciplines;
    }
};

//export
module.exports = Album;
