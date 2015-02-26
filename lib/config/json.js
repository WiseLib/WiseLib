'use strict';

var path = require('path');
var fs = require('fs');

var json_path = path.join('config.json');

var config = {};
  
try {
  config = JSON.parse(fs.readFileSync(json_path));
} catch(e) {
  console.log(e);
}

module.exports = config;
