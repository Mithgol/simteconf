var fs = require('fs');
var os = require('os');
var extend = require('util-extend');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var defaults = {
   EOL: os.EOL,
   skipEmpty: true,
   lowercase: true
}

var simteconf = function(filename, options){
   if(!( this instanceof simteconf )){
      return new simteconf(filename, options);
   }
   this.options = extend(defaults, options);

   this.lines = {};

   var contents, fileLines;
   try{
      contents = fs.readFileSync(filename, {
         encoding: 'utf8'
      });
   }catch(e){
      return;
   }

   fileLines = contents.split( this.options.EOL );
   contents = null;

   _(fileLines).each(function(fileLine){
      fileLine = fileLine.trim();
      if( fileLine.length < 1 ) return;

      var name = _(fileLine).strLeft(' ');
      var content = _(fileLine).strRight(' ');
      content = content.trimLeft();
      if( this.options.skipEmpty && content.length < 1 ) return;

      if( this.options.lowercase ) name = name.toLowerCase();

      if( !_(this.lines).has(name) ){
         this.lines[name] = [];
      }
      this.lines[name].push(content);
   }, this);
   fileLines = null;
}

simteconf.prototype.first = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( !_(this.lines).has(name) ){
      return null;
   }
   return _(this.lines[name]).first();
}

simteconf.prototype.last = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( !_(this.lines).has(name) ){
      return null;
   }
   return _(this.lines[name]).last();
}

simteconf.prototype.random = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( !_(this.lines).has(name) ){
      return null;
   }

   var len = this.lines[name].length;
   if( len <= 1 ) return this.lines[name][0];

   var idx = Math.floor( Math.random() * len );
   if( idx >= len ) idx--;
   return this.lines[name][idx];
}

simteconf.prototype.all = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( !_(this.lines).has(name) ){
      return null;
   }
   return this.lines[name];
}

module.exports = simteconf;