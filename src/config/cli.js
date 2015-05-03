
'use strict';

var _ = require('lodash');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

var assignDeep = function(object, path, value) {
    path.forEach(function(item) {
      if (!(item in object))
        object[item] = {};
      object = object[item];
    });
    object[path[path.length-1]] = value;

};

var config = {};

_.forEach(argv, function(val, arg) {
  assignDeep(config, arg.split('-'), val);
});

module.exports = config;

