Frabjous.Callback = (function(){

  // Return the constructor
  return function(args){

    var that = this;

    // Private methods
    var run = function(name,args){
      var func = that[name];
      if(typeof func == "function"){ func.apply(that,args); }
    };

    // Privileged methods
    this.handle = function(result){
      var args = Array.prototype.slice.call(arguments).slice(1);
      run('completed', args);
      var o = result ? run('success', args) : run('error', args);
    };

    // Public attributes
    this.completed = args.completed;
    this.success   = args.success;
    this.error     = args.error;
  };

})();