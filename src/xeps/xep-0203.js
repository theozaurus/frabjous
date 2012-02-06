//= require jquery
//= require ember
//= require ember-data
//= require ./message
//= require ./presence

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

Frabjous.Parser.register("XEP-0203", function($stanza){
  var delay_stanza = $stanza.find("delay[xmlns='urn:xmpp:delay']");
  
  if(delay_stanza.length > 0){
    var id = $stanza.find('message').attr('id');
    
    var $delay_stanza = $(delay_stanza);
    var delay = {
      id:     id,
      stamp:  $delay_stanza.attr('stamp'),
      from:   $delay_stanza.attr('from'),
      reason: $delay_stanza.text()
    };
    
    parsed = {
      id: $stanza.find('message').attr('id'),
      delay: delay
    };
    
    return parsed;
  }

});