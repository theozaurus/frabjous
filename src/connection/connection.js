//= require_tree ../callbacks
//= require_tree ../primitives

// This object will be overridden by a real connection adapter, but is here as a holding spot
Frabjous.Connection = Ember.Object.create({
  status:  null,
  jid: null,
  connect: function(){
    Frabjous.Log.error("Please override connect with the adapter you want to use");
  },
  bind: function(){
    Frabjous.Log.error("Please override bind with the adapter you want to use");
  },
  _send_now: function(stanza){
    Frabjous.Log.error("Please override _send_now with the adapter you want to use");
  },
  _receive_raw: function(stanza){},
  receive: function(stanza){
    this._receive_raw(stanza);
    
    // Called when a XMPP stanza is received
    var s = new Frabjous.Stanza(stanza);
    
    // Parse stanza
    var object = Frabjous.Parser.handle(s);
    
    // Deal with callbacks
    this.get('callbacks').handle(object.get('is_success'),object);
  },
  send: function(stanza,callbacks){
    // Used to deal with callbacks before handing off to low level XMPP client
    var s = new Frabjous.Stanza(stanza);
    callbacks = callbacks || [];
    
    var obj = Frabjous.Parser.handle(s);
    if(obj){
      var outgoing_id  = obj.get('id');
      // Add ID matching if not already existing
      if(!(callbacks instanceof Array) && typeof callbacks == 'object'){ callbacks = [callbacks]; }
      $.each(callbacks,function(i,c){
        if(!c.is_match){
          c.is_match = function(incoming){ return incoming.get('id') == outgoing_id; };
        }
      });      
    }

    this.get('callbacks').add(callbacks);
    
    this._send_now(stanza);
    
    return obj;
  },
  callbacks: new Frabjous.CallbackList()
});
