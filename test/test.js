var fs = require('fs');
var path = require('path');
var assert = require('assert');
var filename = path.join(__dirname, 'simteconf.conf');

describe('Integrity of the test', function(){
   it('test file is found', function(){
      assert.ok( fs.existsSync(filename) );
   });
});

var simteconf = require('..');
var conf = simteconf(filename);

describe('Simple configuration', function(){
   it('not repeated lines', function(){
      assert.equal( conf.first('samia'), 'dostika' );
      assert.equal( conf.last('ari'), 'adritida' );
      assert.deepEqual( conf.all('tori'), ['adito madola'] );
   });
   it('repeated lines', function(){
      assert.equal( conf.first('witch'), 'Charlotte' );
      assert.equal( conf.last('Witch'), 'Kriemhild Gretchen' );
      assert.deepEqual( conf.all('witch'), ['Charlotte', 'Oktavia', 'Kriemhild Gretchen'] );
   });
});