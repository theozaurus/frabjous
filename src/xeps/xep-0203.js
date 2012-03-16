//= require jquery
//= require ember
//= require ember-data
//= require ./message
//= require ./presence
//= require ./xep-0082

Frabjous.Delay = DS.Model.extend({
  stamp:  DS.attr('Xep0082dateString'),
  from:   DS.attr('jidString'),
  reason: DS.attr('string')
});

Frabjous.Delay.instance_properties = {
  delay: DS.hasOne(Frabjous.Delay, { embedded: true }),
  created_at: DS.attr('Xep0082dateString'),
  received_at: function(){
    var delay = this.get('delay');
    if(delay){
      return delay.get('stamp');
    }else{
      return this.get('created_at');
    }
  }.property('delay','created_at')
};

Frabjous.Delay.sort = function(a,b){
  return a.get("received_at") - b.get("received_at");
};

Frabjous.Message.reopen( Frabjous.Delay.instance_properties );
Frabjous.Presence.reopen( Frabjous.Delay.instance_properties );

Frabjous.Contact.reopen({
  presence_history: function(){
    return this.get('_presence_history').slice().sort(Frabjous.Delay.sort);
  }.property('_presence_history')
});

Frabjous.Contact.reopen({
  messages: function(){
    return this.get('_messages').slice().sort(Frabjous.Delay.sort);
  }.property('_messages')
});

Frabjous.Parser.register("XEP-0203", function(stanza){
  if( stanza.is_message() || stanza.is_presence() ){
    // At least have a message or presence, so add a created_at
    parsed = {
      id: stanza.id(),
      created_at: Frabjous.Xep0082.toString(new Date())
    };
    
    var delay_stanza = stanza.root().find("delay[xmlns='urn:xmpp:delay']");
    if(delay_stanza.length > 0){
      var $delay_stanza = $(delay_stanza);
      var delay = {
        id:     stanza.id(),
        stamp:  $delay_stanza.attr('stamp'),
        from:   $delay_stanza.attr('from'),
        reason: $delay_stanza.text()
      };
      parsed.delay = delay;
    }
    return parsed;
  }
});