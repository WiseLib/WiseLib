'use strict';
/**
 * An error to signal that a resource with name wasn't found
 * @param {String} name Name of resource that wasn't found
 */
function NotFoundError(name) {
	this.status = 404;
	this.statusText = name + ' was not found.';

}
NotFoundError.prototype = Object.create(Error.prototype);

/**
 * An error to signal that a certain functionality isn't implemented
 */
function NotImplementedError() {
	this.status = 501;
	this.statusText = 'Not implemented';
}
NotImplementedError.prototype = Object.create(Error.prototype);

module.exports.NotFoundError = NotFoundError;
module.exports.NotImplementedError = NotImplementedError;