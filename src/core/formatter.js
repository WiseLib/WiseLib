'use strict';
// Src: http://team.158ltd.com/2014/10/30/node-js-read-base64-image-decode-it-strip-tags-and-save-to-disk/
/* Decode base64 image and save to disk
 * @param base64 (string) dataString base64 encoded image
 * @throws TypeError wrong argument
 * @constructor
 */
var Formatter = function(base64) {
	if(typeof(arg) === 'string') {
		this.base64 = base64;
	}
	else {
		throw new TypeError('invalid argument : ' + arg + ' is a ' + typeof(arg));
	}
};
/* Decode base64 image and save to disk
 * @return string path of saved file
 * @public
 */
Formatter.prototype.format = function() {
	// Regular expression for image type:
    // This regular image extracts the "jpeg" from "image/jpeg"
    var imageTypeRegularExpression = /\/(.*?)$/;

    // Generate random string
    var crypto = require('crypto');
    var seed = crypto.randomBytes(20);
    var uniqueSHA1String = crypto.createHash('sha1').update(seed).digest('hex');

    var matches = this.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3)
    {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    var userUploadedFeedMessagesLocation = 'img/pi/';

    // This variable is actually an array which has 5 values,
    // The [1] value is the real image extension
    var imageTypeDetected = response.type.match(imageTypeRegularExpression);
    var userUploadedImagePath = userUploadedFeedMessagesLocation + uniqueSHA1String + '.' + imageTypeDetected[1];
    // Save decoded binary image to disk
    require('fs').writeFileSync(userUploadedImagePath, response.data);
    return userUploadedImagePath;
};

module.exports = Formatter;