Frabjous.Callback = (function(){

  // Return the constructor
  return function(args){

    var that = this;

    // Private methods
    var run = function(name,args){
      var func = that[name];
      if(typeof func == "function"){ func.apply(that,args); }
    };
    
    var test_must_keep = function(){
      var args = Array.prototype.slice.call(arguments);
      if(typeof that.must_keep == "function"){
        // Run the function if possible
        return that.must_keep.apply(this,args);
      }else if(typeof that.must_keep != "undefined"){
        // Return the value if available
        return that.must_keep;
      }else{
        // By default return false
        // we don't want callbacks hanging around
        return false;
      }
    };

    // Privileged methods
    this.handle = function(result){
      var args = Array.prototype.slice.call(arguments).slice(1);
      if(that.is_match.apply(this,args)){
        run('completed', args);
        var o = result ? run('success', args) : run('error', args);
        return test_must_keep.apply(this,args);
      }
      // Must be kept until code has been run
      return true;
    };

    // Public attributes
    this.completed  = args.completed;
    this.success    = args.success;
    this.error      = args.error;
    this.is_match   = args.is_match;
    this.must_keep  = args.must_keep;
    
    
    if(typeof this.is_match != "function"){
      throw("Callback created without an is_match function");
    }
  };

})();