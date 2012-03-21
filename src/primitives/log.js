Frabjous.log = {
  level:  false,
  levels: ["log", "debug", "info", "warn", "error"],
};

$.each( Frabjous.log.levels, function(i, name) {
  Frabjous.log[name] = function() {
    var level  = Frabjous.log.level;
    var levels = Frabjous.log.levels;
    if(level && levels.indexOf(name) >= levels.indexOf(level)){
      // Make arguments play like an array
      var args = Array.prototype.slice.call(arguments,0);
      if (typeof window.console != 'undefined') {
        window.console[name].apply(console,args);
      }
    }
   };
});
