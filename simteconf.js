var fs = require('fs');
var extend = require('extend');
var iconv = require('iconv-lite');

var strLeft = require('underscore.string/strLeft');
var strRight = require('underscore.string/strRight');
var ltrim = require('underscore.string/ltrim');

var startWithOneOf = (inString, inArray) => {
   if( !Array.isArray(inArray) ) return false;

   for( var i = 0; i < inArray.length; i++ ){
      if( inString.startsWith(inArray[i]) ) return true;
   }
   return false;
};

var beforeSpace = inString => {
   if(!( inString.includes(' ') )) return inString;

   return strLeft(inString, ' ');
};

var afterSpace = inString => {
   if(!( inString.includes(' ') )) return '';

   return ltrim( strRight(inString, ' ') );
};

var defaults = {
   EOL: /\r|\n/,
   encoding: 'utf8',
   skipEmpty: true,
   lowercase: true,
   skipNames: false,    // possibly array
   prefixGroups: false  // possibly array
};

var groupDefaults = {
   lowercase: true
};

var lineGroup = function(options){
   if(!( this instanceof lineGroup )){
      return new lineGroup(options);
   }
   this.options = extend({}, groupDefaults, options);
   this.lines = {};
};

lineGroup.prototype.push = function(name, value){
   if( typeof this.lines[name] === 'undefined' ) this.lines[name] = [];

   this.lines[name].push(value);
};

lineGroup.prototype.names = function(){
   return Object.keys(this.lines);
};

lineGroup.prototype.first = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( typeof this.lines[name] === 'undefined' ) return null;

   return this.lines[name][0];
};

lineGroup.prototype.last = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( typeof this.lines[name] === 'undefined' ) return null;

   var len = this.lines[name].length;
   return this.lines[name][len-1];
};

lineGroup.prototype.random = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( typeof this.lines[name] === 'undefined' ) return null;

   var len = this.lines[name].length;
   if( len <= 1 ) return this.lines[name][0];

   var idx = Math.floor( Math.random() * len );
   if( idx >= len ) idx--;
   return this.lines[name][idx];
};

lineGroup.prototype.all = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( typeof this.lines[name] === 'undefined' ) return null;

   return this.lines[name];
};

var simteconf = function(filename, options){
   if(!( this instanceof simteconf )){
      return new simteconf(filename, options);
   }
   this.options = extend({}, defaults, options);

   if( this.options.lowercase ){
      if( this.options.skipNames ){
         this.options.skipNames = this.options.skipNames.map(
            value => value.toLowerCase()
         );
      }
      if( this.options.prefixGroups ){
         this.options.prefixGroups = this.options.prefixGroups.map(
            value => value.toLowerCase()
         );
      }
   }

   this.mainGroup = this.createLineGroup(this.options);
   this.groups = {};

   var readBuffer, contents, fileLines;
   if( typeof filename !== 'string' ) return;
   try{
      readBuffer = fs.readFileSync(filename);
   } catch(e) {
      return;
   }
   contents = iconv.decode(readBuffer, this.options.encoding);
   readBuffer = null;

   fileLines = contents.split( this.options.EOL );
   contents = null;

   fileLines.forEach(fileLine => {
      fileLine = fileLine.trim();
      if( fileLine.length < 1 ) return;

      var name = beforeSpace(fileLine);
      if( this.options.lowercase ) name = name.toLowerCase();

      if(
         this.options.skipNames &&
         startWithOneOf(name, this.options.skipNames)
      ){
         return;
      }

      var targetGroup = this.mainGroup;
      if(
         this.options.prefixGroups &&
         this.options.prefixGroups.indexOf(name) !== -1
      ){
         // ignore the line if there's nothing after the group's prefix
         fileLine = afterSpace(fileLine);
         if( fileLine.length < 1 ) return;

         // grab the alternate target group
         if( typeof this.groups[name] === 'undefined' ){
            this.groups[name] = this.createLineGroup(this.options);
         }
         targetGroup = this.groups[name];

         // the group's name is no longer necessary, read the option's name
         name = beforeSpace(fileLine);
         if( this.options.lowercase ) name = name.toLowerCase();
      } // fileLine is carefully altered, it's OK to get the content from it
      var content = afterSpace(fileLine);
      if( this.options.skipEmpty && content.length < 1 ) return;

      targetGroup.push(name, content);
   }, this);
   fileLines = null;
};

simteconf.prototype.createLineGroup = function(options){
   return lineGroup({
      lowercase: options.lowercase
   });
};

simteconf.prototype.group = function(name){
   if( this.options.lowercase ) name = name.toLowerCase();

   if( typeof this.groups[name] === 'undefined' ){
      return this.createLineGroup(this.options);
   }
   return this.groups[name];
};

simteconf.prototype.names = function(){
   return this.mainGroup.names();
};

simteconf.prototype.first = function(name){
   return this.mainGroup.first(name);
};

simteconf.prototype.last = function(name){
   return this.mainGroup.last(name);
};

simteconf.prototype.random = function(name){
   return this.mainGroup.random(name);
};

simteconf.prototype.all = function(name){
   return this.mainGroup.all(name);
};

module.exports = simteconf;