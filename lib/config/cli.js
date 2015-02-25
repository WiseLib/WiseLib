
'use strict';

var _ = require('lodash');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

var assignDeep = function(object, path, value) {
    for(var i = 0; i < path.length - 1; ++i) {
      if (!(path[i] in object))
        object[path[i]] = {};
      object = object[path[i]];
    }
    object[path[path.length-1]] = value;
      
};

var config = {};

_.forEach(argv, function(val, arg) {
  assignDeep(config, arg.split('-'), val);
});

module.exports = config;

