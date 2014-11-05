/*
 * server
 * https://github.com/WiseLib/server
 *
 * Copyright (c) 2014 WiseLib
 * Licensed under the GPL-2.0 license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var server = require('../lib/server.js');

describe('server module', function(){
  describe('#awesome()', function(){
    it('should return a hello', function(){
      server.awesome('livia').should.equal("hello livia");
    });
  });
});
