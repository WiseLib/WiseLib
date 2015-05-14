#!/usr/bin/env node

/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2015 WiseLib
 * Licensed under the GPL-2.0 license.
 */
var express = require('express');

var server = require('../index');


var app = express();
server(app);
app.listen(8080);
