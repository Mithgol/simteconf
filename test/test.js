/*global describe, it */
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var filename = path.join(__dirname, 'simteconf.conf');

describe('The test itself', function(){
   it('contains the test file', function(){
      assert.ok( fs.existsSync(filename) );
   });
});

var simteconf = require('..');
var conf = simteconf(filename);
var noComments = simteconf(filename, {
   skipNames: ['//', '#'],
   encoding: 'windows-1251'
});
var witchConf = simteconf(filename, {
   skipNames: ['//', '#'],
   prefixGroups: ['wiTCH'],
   skipEmpty: false
});

describe('Simple configuration', function(){
   it('works with not repeated lines', function(){
      assert.equal( conf.first('samia'), 'dostika' );
      assert.equal( conf.last('ari'), 'adritida' );
      assert.deepEqual( conf.all('tori'), ['adito madola'] );
   });
   it('gets one (or more) of repeated lines', function(){
      assert.equal( conf.first('witch'), 'Charlotte' );
      assert.equal( conf.last('Witch'), 'Kriemhild Gretchen' );
      assert.deepEqual(
         conf.all('witch'), ['Charlotte', 'Oktavia', 'Kriemhild Gretchen']
      );
   });
   it('makes random selections', function(){
      assert.equal( conf.random('samia'), 'dostika' );
      assert.equal( conf.random('tori'), 'adito madola' );
      assert.ok( conf.all('witch').indexOf( conf.random('witch') ) > -1 );
   });
   it('returns null for missing lines', function(){
      assert.equal( conf.first('Mami'), null );
      assert.equal( conf.last(' '), null );
   });
   it('processes comments', function(){
      assert.equal( conf.first('#'), 'Sis puella magica!' );
      assert.equal(
         conf.first('//'), 'the previous line contains a whitespace'
      );
   });
   it('ignores comments (when told to ignore)', function(){
      assert.equal( noComments.last('#'), null );
      assert.equal( noComments.first('//'), null );
   });
   it('groups lines based on the prefix', function(){
      assert.equal( witchConf.group('witch').first('charLotte'), '');
      assert.equal( witchConf.group('WItch').last('OKtaVIA'), '');
      assert.equal( witchConf.group('wiTCH').random('kriemhild'), 'Gretchen');
   });
   it('ignores lines with defined group prefixes', function(){
      assert.equal( witchConf.first('witch'), null);
      assert.equal( witchConf.last('WItch'), null);
      assert.equal( witchConf.random('wiTCH'), null);
   });
   it('lists names of configuration lines', function(){
      assert.deepEqual(
         witchConf.group('witch').names(),
         ['charlotte', 'oktavia', 'kriemhild']
      );
      assert.deepEqual(
         noComments.names(),
         ['samia', 'ari', 'tori', 'witch']
      );
   });
});