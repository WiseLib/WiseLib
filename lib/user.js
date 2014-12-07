'use strict';
/**
 * Creates an instance of a User
 * @param {object} data This object contains all data necessary for the construction of a User
 */
function User(data) {
	for (var x in data) {
		this[x] = data[x];
	}
}