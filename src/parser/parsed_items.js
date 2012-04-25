//// This is used by the handlers to build up objects before they are turned into ember objects
Frabjous.ParsedItems = function(){
  // Private attributes
  var data = {};
  
  var deep_merge = function(obj1, obj2) {
    for (var p in obj2) {
      if( obj2.hasOwnProperty(p) ){
        try {
          // Property in destination object set; update its value.
          if ( obj2[p].constructor == Object ) {
            obj1[p] = deep_merge(obj1[p], obj2[p]);
          } else {
            obj1[p] = obj2[p];
          }
        } catch(e) {
          // Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p];
        }
      }
    }

    return obj1;
  };
  
  // Privileged methods
  this.add = function(newItem){
    if(!Ember.none(newItem) && !Ember.none(newItem.id)){
      var id = newItem.id;
      var originalItem = data[id];
      if(typeof originalItem == "undefined"){
        originalItem = {};
      }

      // Track store value
      storeOrig = originalItem.store;
      storeNew  = newItem.store;
      
      originalItem = deep_merge(originalItem,newItem);
      
      // If store value has been set on either to true then
      // make sure the originalItem is updated to have it true too
      if(!Ember.none(storeNew)||!Ember.none(storeOrig)){
        originalItem.store = storeOrig || storeNew;
      }
      
      data[id] = originalItem;
      return originalItem;
    }    
  };
  
  this.all = function(){
    var array = [];
    for(var key in data){
      if(data.hasOwnProperty(key)){
        array.push(data[key]);
      }
    }
    return array;
  };
};