/**
 *
 * 
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var package_file = path.join(__dirname, '../../package.json');

var config = {};
  
try {
  config = JSON.parse(fs.readFileSync(package_file)).config;
} catch(e) {
  console.log(e);
}

var assignDeep = function(object, path, value) {
    for(var i = 0; i < path.length - 1; ++i) {
      if (!(path[i] in object))
        object[path[i]] = {};
      object = object[path[i]];
    }
    object[path[path.length-1]] = value;
      
};

var config_envs = _.filter(_.keys(process.env), function(key) {
    return _(key).startsWith('npm_package_config');
});

_.forEach(config_envs, function(key) {
    assignDeep(config, key.split('_').slice(3), process.env[key]);
});

module.exports = config;

