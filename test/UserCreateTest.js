var should = require('should');

var user = require('../../server/lib/user.js')

describe('User', function(){
  describe('#create()', function(){
    it('should create user without error', function(done){
      var user = new User('Test man');
      user.create(function(err){
        if (err) throw err;
        done();
      });
    })
  })
})