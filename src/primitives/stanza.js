Frabjous.Stanza = (function(){
  
  // Private class methods
  var coerse_to_document_object = function(s){
    if(typeof s == "string"){
      s = $.parseXML(s);
    }
    return s;
  };
  
  var id_count = 0;
  var generate_id = function(){
    return "generated-" + id_count++;
  };
  
  // Return the constructor  
  return function(stanza){
    
    // Private attributes
    var $stanza = $(coerse_to_document_object(stanza));
    
    // Used to memoize methods that have no arguments
    // By replacing themselves with a function that
    // returns the result
    var that = this;
    var memoize = function(name, expensive_function){
      that[name] = function(){
        var result = expensive_function();
        that[name] = function(){ return result; };
        return result;
      };
    };
    
    // Public attributes
    this.raw = stanza;
    
    // Privileged methods
    // this.root 
    memoize('root', function(){
      return $stanza.find("*");
    });

    // this.id    
    memoize('id', function(){
      var id = that.root().attr('id');
      if( Ember.empty(id) ){ id = generate_id(); }
      return id;
    });
    
    // this.from
    memoize('from', function(){
      return that.root().attr('from');
    });
    
    // this.to
    memoize('to', function(){
      return that.root().attr('to');
    });
    
    // this.type
    memoize('type', function(){
      return that.root().attr('type');
    });

    // this.is_message
    memoize('is_message', function(){
      return $stanza.find("message").length > 0;
    });
    
    // this.is_presence
    memoize('is_presence', function(){
      return $stanza.find("presence").length > 0;
    });
    
    // this.is_iq
    memoize('is_iq', function(){
      return $stanza.find("iq").length > 0;
    });
    
    this.toString = function(){
      return this.raw;
    };
  };
})();