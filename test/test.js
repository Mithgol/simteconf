/*global describe, it */
var fs = require('fs');
var path = require('path');
var extend = require('util')._extend;
var assert = require('assert');
var filename = path.join(__dirname, 'simteconf.conf');

describe('hidden util._extend(defaults, options) method', function(){
   it('returns defaults if options are missing', function(){
      assert.deepEqual(
         extend({foo: 'bar', baz: ['qux', 'quux']}),
         {foo: 'bar', baz: ['qux', 'quux']}
      );
   });
   it('adds elements of options to defaults', function(){
      assert.deepEqual(
         extend({foo: 'bar', baz: ['qux', 'quux']}, {jinx: 'added'}),
         {foo: 'bar', baz: ['qux', 'quux'], jinx: 'added'}
      );
   });
   it('replaces defaults with options (one level deep)', function(){
      assert.deepEqual(
         extend({foo: 'bar', baz: ['qux', 'quux']}, {foo: 'replaced'}),
         {foo: 'replaced', baz: ['qux', 'quux']}
      );
   });
   it('replaces entire array elements (does not extend them)', function(){
      assert.deepEqual(
         extend({foo: 'bar', baz: ['qux', 'quux']}, {baz: ['replaced']}),
         {foo: 'bar', baz: ['replaced']}
      );
   });
   it('does not extend nested objects (replaces them instead)', function(){
      assert.deepEqual(
         extend({foo: 'bar', baz: {qux: 'quux'}}, {baz: {jinx: 'replaced'}}),
         {foo: 'bar', baz: {jinx: 'replaced'}}
      );
   });
});

describe('The test itself', function(){
   it('contains the test file', function(){
      assert.ok( fs.existsSync(filename) );
   });
});

var simteconf = require('..');
var conf = simteconf(filename);
var noComments = simteconf(filename, {
   skipNames: ['//', '#']
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
});