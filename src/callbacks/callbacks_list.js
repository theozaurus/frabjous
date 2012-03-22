Frabjous.CallbackList = (function(){
  
  // Return the constructor
  return function(){
    
    // Private variables
    var list = {};
    
    // Private functions
    make_array = function(callbacks){
      if(!(callbacks instanceof Array)){
        callbacks = [callbacks];
      }
      return callbacks;
    };
    
    martial = function(callbacks){
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
    this.find = function(id){
      return list[id] || [];
    };
    
    this.add = function(id,callbacks){    
      // Make sure callbacks is always an array
      callbacks = make_array(callbacks);
      
      // Make sure callbacks are Frabjous.Callback
      callbacks = martial(callbacks);
      
      // Add them
      var current = this.find(id);
      list[id] = current.concat.apply(current,callbacks);
    };
    
    this.clear = function(id){
      // Will clear all callbacks for a specified id
      delete list[id];
    };
    
    this.clear_all = function(){
      // Will clear all callbacks
      list = {};
    };
    
    this.handle = function(id,issuccess){
      // Get all arguments passed bar first one
      var args = Array.prototype.slice.call(arguments).slice(1);
      $.each(this.find(id),function(i,callback){
        callback.handle.apply(this,args);
      });
      // Clean up callbacks
      this.clear(id);
    };
    
  };
  
})();