//= depend_on jquery
//= depend_on ember
//= depend_on ember-data

Frabjous = {};

// Primitives
Frabjous.Jid = Ember.Object.extend({
  jid: "",
  bare: function(){
    var m = this.get('_matches');
    return [m[0],m[1]].join("@");
  }.property('_matches'),
  node: function(){
    return this.get('_matches')[0];
  }.property('_matches'),
  domain: function(){
    return this.get('_matches')[1];
  }.property('_matches'),
  resource: function(){
    return this.get('_matches')[2];
  }.property('_matches'),
  _matches: function(){
    var matches = /^(([^@ ]+)@)?([^\/]+)(\/(.+))?$/.exec(this.get('jid'));
    return [matches[2],matches[3],matches[5]];
  }.property('jid'),
  toString: function(){
    var jid = this.get('jid');
    return Em.none(jid) ? "" : jid;
  }
});

DS.attr.transforms.jidString = {
  from: function(serialized) {
    return Frabjous.Jid.create({
      jid: serialized
    });
  },
  to: function(deserialized) {
    return Em.none(deserialized) ? null : deserialized.get('jid');
  }
};

// General parser
Frabjous = {};

Frabjous.Parser = function(){
  var _handlers = {};
  
  return {
    handle: function(stanza){
      for(var h in _handlers){
        if(_handlers.hasOwnProperty(h)){
          _handlers[h].parse(stanza);
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


// Store
Frabjous.Store = DS.Store.create({});

// Presence
//// Model
Frabjous.Presence = DS.Model.extend({
  from:    DS.attr('jidString'),
  to:      DS.attr('jidString'),
  type:    DS.attr('string'),
  status:  DS.attr('string'),
  show:    DS.attr('string'),
  subject: DS.attr('string')
});

// Messages
//// Model
Frabjous.Message = DS.Model.extend({
  from:    DS.attr('jidString'),
  to:      DS.attr('jidString'),
  type:    DS.attr('string'),
  body:    DS.attr('string'),
  subject: DS.attr('string')
});

//// Parser


// XEP-0203
//// Extend model
Frabjous.Delay = DS.Model.extend({
  stamp:  DS.attr('date'),
  from:   DS.attr('jidString'),
  reason: DS.attr('string')
});

Frabjous.Delay.instance_properties = {
  delay: DS.hasOne(Frabjous.Delay, { embedded: true }),
  received_at: function(){
    var delay = this.get('delay');
    if(delay){
      delay.get('stamp');
    }else{
      this.get('created_at');
    }
  }.property('delay','created_at')
};

Frabjous.Delay.class_properties = {
  create: function(args){
    args.created_at = new Date();
    return this._super(args);
  }
};

Frabjous.Message.reopen( Frabjous.Delay.instance_properties );
Frabjous.Message.reopenClass( Frabjous.Delay.class_properties );

Frabjous.Presence.reopen( Frabjous.Delay.instance_properties );
Frabjous.Presence.reopenClass( Frabjous.Delay.class_properties );


//// Parser
Frabjous.Parser.register("XEP-0203", function($stanza){
  var delay_stanza = $stanza.find("delay[xmlns='urn:xmpp:delay']");
  
  if(delay_stanza.length > 0){
    var $delay_stanza = $(delay_stanza);
    var delay = {
      stamp:  $delay_stanza.attr('stamp'),
      from:   $delay_stanza.attr('from'),
      reason: $delay_stanza.text()
    };
    
    // Find message or presence object and do the business
  }

});