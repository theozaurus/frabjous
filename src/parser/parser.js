//= require ./parsed_items
//= require ../storage/store

Frabjous.Parser = function(){
  // Private
  var _handlers = {};

  var create_or_update = function(item){
    var frabjous_type = item.frabjous_type;
    delete item.frabjous_type;
    
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

  var create_temporary = function(item){
    Frabjous.log.debug("Creating temporary object");
    var o = Frabjous.Temporary.create();
    for(var n in item){
      if(item.hasOwnProperty(n)){
        o.set(n,item[n]);
      }
    }
    return o;
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
          var result;
          var item = items[i];
          Frabjous.log.debug("Parsed "+item.frabjous_type+":",item);
          if(!items[i].hasOwnProperty('store') && item.load !== false){
            result = create_or_update(item);
          }else{
            result = create_temporary(item);
          }
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