'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var packageFile = path.join(__dirname, '../../package.json');

var config = {};

try {
    config = JSON.parse(fs.readFileSync(packageFile)).config;
} catch(e) {
    console.log(e);
}

var assignDeep = function(object, path, value) {
    path.forEach(function(item) {
      if (!(item in object))
        object[item] = {};
      object = object[item];
    });
    object[path[path.length-1]] = value;
};

var configEnvs = _.filter(_.keys(process.env), function(key) {
    return _(key).startsWith('npm_package_config');
});

_.forEach(configEnvs, function(key) {
    assignDeep(config, key.split('_').slice(3), process.env[key]);
});

module.exports = config;

