'use strict';
var _ = require('lodash');

var config = _.assign(
  require('./config/npm.js'),
  require('./config/json.js'),
  require('./config/cli.js')
);

config.env = process.env.NODE_ENV || 'development';

module.exports = config;

