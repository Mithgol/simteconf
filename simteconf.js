var simteconf = function(filename, options){
   if(!( this instanceof simteconf )){
      return new simteconf(filename, options);
   }
}

module.exports = simteconf;