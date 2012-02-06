//= require ./parsed_items
//= require ../storage/store

Frabjous.Parser = function(){
  // Private
  var _handlers = {};
  
  return {
    // Class Methods
    handle: function(stanza){
      var itemsList = new Frabjous.ParsedItems();
      
      for(var h in _handlers){
        if(_handlers.hasOwnProperty(h)){
          var parsed = _handlers[h].parse(stanza);
          itemsList.add(parsed);
        }
      }
      
      var items = itemsList.all();
      for(var i in items){
        if(items.hasOwnProperty(i)){
          var item = items[i];
          var frabjous_type = item.frabjous_type;
          delete item.frabjous_type;
          
          Frabjous.Store.load(frabjous_type,item);
        }
      }
      
    },
    handlers: function(){
      return _handlers;
    },
    register: function(name,func){
      _handlers[name] = {
        name:  name,
        parse: func
      };
    }
  };
  
}();