var fs = require('fs');
var path = require('path');
var assert = require('assert');
var filename = path.join(__dirname, 'simteconf.conf');

describe('Test integrity', function(){
   it('Test file is found', function(){
      assert.ok( fs.existsSync(filename) );
   });
});