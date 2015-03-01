'use strict';

var path = require('path');
var fs = require('fs');

var jsonPath = path.join('config.json');

var config = {};
  
try {
	config = JSON.parse(fs.readFileSync(jsonPath));
} catch(e) {
	console.log(e);
}

module.exports = config;