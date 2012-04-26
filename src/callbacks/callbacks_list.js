Frabjous.CallbackList = (function(){
  
  // Return the constructor
  return function(){
    
    // Private variables
    var list;
    
    // Private functions
    make_array = function(callbacks){
      if(!(callbacks instanceof Array)){
        callbacks = [callbacks];
      }
      return callbacks;
    };
    
    marshal = function(callbacks){
      callbacks = $.map(callbacks,function(c){
        if(c instanceof Frabjous.Callback){
          return c;
        }else{
          return new Frabjous.Callback(c);
        }
      });
      return callbacks;
    };
    
    // Privileged functions
    this.size = function(){
      return list.length;
    };
    
    this.add = function(callbacks){    
      // Make sure callbacks is always an array
      callbacks = make_array(callbacks);
      
      // Make sure callbacks are Frabjous.Callback
      callbacks = marshal(callbacks);
      
      // Add them
      list = list.concat.apply(list,callbacks);
      return callbacks;
    };
    
    this.clear = function(){
      list = [];
    };
    
    this.handle = function(issuccess){
      // Scan list in reverse order so we can delete elements
      // without causing problems
      var args = Array.prototype.slice.call(arguments);
      for(var i = list.length - 1; i >= 0; i--){
        // Call handle on each callback
        var result = list[i].handle.apply(this,args);
        // Returned falsey so remove callback
        if(!result){ list.splice(i,1); }
      }
    };
    
    // Initialize list
    this.clear();
    
  };
  
})();