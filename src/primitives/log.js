Frabjous.Log = {
  level:  false,
  levels: ["log", "debug", "info", "warn", "error"],
};

$.each( Frabjous.Log.levels, function(i, name) {
  Frabjous.Log[name] = function() {
    var level  = Frabjous.Log.level;
    var levels = Frabjous.Log.levels;
    if(level && levels.indexOf(name) >= levels.indexOf(level)){
      // Make arguments play like an array
      var args = Array.prototype.slice.call(arguments,0);
      if (typeof window.console != 'undefined') {
        window.console[name].apply(console,args);
      }
    }
   };
});
