//= require ./parsed_items
//= require ../storage/store

Frabjous.Parser = function(){
  // Private
  var _handlers = {};

  return {
    // Class Methods
    handle: function(stanza){
      Frabjous.log.debug("Received:", stanza.toString());
      var itemsList = new Frabjous.ParsedItems();
      
      for(var h in _handlers){
        if(_handlers.hasOwnProperty(h)){
          var parsed = _handlers[h].parse(stanza);
          itemsList.add(parsed);
        }
      }
      
      var items = itemsList.all();
      var first_result;
      for(var i in items){
        if(items.hasOwnProperty(i)){
          var item = items[i];
          var frabjous_type = item.frabjous_type;
          delete item.frabjous_type;
          Frabjous.log.debug("Parsed "+frabjous_type+":",item);
          var result = Frabjous.Store.load_and_find(frabjous_type,item);
          if(Ember.none(first_result)){ first_result = result; }
        }
      }
      return first_result;
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