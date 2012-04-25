//= require ./parsed_items
//= require ../storage/store

Frabjous.Parser = function(){
  // Private
  var _handlers = {};

  var create_or_update = function(item){
    var frabjous_type = item.frabjous_type;
    delete item.frabjous_type;
    
    Frabjous.log.debug("Parsed "+frabjous_type+":",item);
    
    // Consider handling errors in another way
    var existing  = !Ember.none(Frabjous.Store.clientIdForId(frabjous_type,item.id));
    var has_error = !Ember.none(item.error);
    if(existing && has_error){
      Frabjous.log.debug("Adding error to existing object "+frabjous_type+":",item.error);
      var o = Frabjous.Store.find(frabjous_type,item.id);
      var raw = o.toJSON();
      raw.error = item.error;
      return Frabjous.Store.load_and_find(frabjous_type,raw);
    } else {
      // No error, or no existing object
      Frabjous.log.debug("Creating new object "+frabjous_type+":",item);
      return Frabjous.Store.load_and_find(frabjous_type,item);
    }
  };

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
          // Create or update an item unless the parser has set store to false
          if(!items[i].hasOwnProperty('store') && items[i].load !== false){
            var result = create_or_update(items[i]);
            if(Ember.none(first_result)){ first_result = result; }
          }
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