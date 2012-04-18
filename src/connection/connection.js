// This object will be overridden by a real connection adapter, but is here as a holding spot
Frabjous.Connection = Ember.Object.create({
  status:  null,
  connect: function(){
    Frabjous.Log.error("Please override connect with the adapter you want to use");
  },
  bind: function(){
    Frabjous.Log.error("Please override bind with the adapter you want to use");
  },
  _send_now: function(stanza){
    Frabjous.Log.error("Please override _send_now with the adapter you want to use");
  },
  receive: function(stanza){
    // Called when a XMPP stanza is received
    var s = new Frabjous.Stanza(stanza);
    
    // Parse stanza
    var object = Frabjous.Parser.handle(s);
    
    // Deal with callbacks
    this.get('callbacks').handle(s.id(),object.get('is_success'),object);
  },
  send: function(stanza,callbacks){
    // Used to deal with callbacks before handing off to low level XMPP client
    var s = new Frabjous.Stanza(stanza);
    callbacks = callbacks || [];
    
    this.get('callbacks').add(s.id(),callbacks);
    var obj = Frabjous.Parser.handle(s);
    
    this._send_now(stanza);
    
    return obj;
  },
  callbacks: new Frabjous.CallbackList()
});
