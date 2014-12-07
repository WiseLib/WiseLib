'use strict';

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

var _ = require('lodash');
var _routes = _(require('./routes'));

//ERROR : bodyParser is now an external module, need to be added
//app.use(express.bodyParser());

var errorPage = function(req, res) {
  res.send('method not supported');
}

var _methods = _(['get', 'post', 'put', 'patch', 'delete']);

module.exports = function (app) {
  
  // register all controllers
  _routes.forEach(function (operations, path) {
    console.log('route', path);
    _methods.forEach(function (method) {
      if (operations[method])
        console.log('  - %s', method.toUpperCase());
      app[method](path + '.json', operations[method] || errorPage);
    })
  });

  // serve redirect for static files
  app.get('*', function(req, res) {
      res.sendFile(req.path, {root: __dirname + '/../public/'});
  });

};

