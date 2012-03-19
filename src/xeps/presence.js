//= require ember
//= require ember-data
//= require ./contact

Frabjous.Presence = DS.Model.extend({
  from:      DS.attr('jidString'),
  to:        DS.attr('jidString'),
  type:      DS.attr('string'),
  status:    DS.attr('string'),
  show:      DS.attr('string'),
  subject:   DS.attr('string'),
  priority:  DS.attr('number'),
  contact:   DS.belongsTo('Frabjous.Contact'),
  didLoad: function(){
    var contact;
    var type      = Frabjous.Contact;
    var id        = this.get('from').toString();
    var client_id = Frabjous.Store.clientIdForId(type, id);
    
    if( Ember.none(client_id) ){
      // No contact exists, so create one
      Frabjous.Store.load(type,{jid: id, _presence_history:[this.get('id')]});
      contact = Frabjous.Store.find(type,id);
    }else{
      // Update contact
      contact = Frabjous.Store.find(type,id);
      contact.get('_presence_history').addObject(this);
    }
    
    this.set('contact',contact);
  }
});

Frabjous.Contact.reopen({
  // Allows me to override the ordering in XEP-0203, I don't like this method
  _presence_history: DS.hasMany('Frabjous.Presence'),
  presence_history: function(){ return this.get('_presence_history'); }.property('_presence_history'),
  presence: function(){
    return this.get('presence_history').get('lastObject');
  }.property('presence_history')
});

Frabjous.Parser.register("Presence", function(stanza){
  
  if( stanza.is_presence() ){
    var parsed = {};
    parsed.id       = stanza.id();
    parsed.from     = stanza.from();
    parsed.to       = stanza.to();
    parsed.type     = stanza.type();
    parsed.show     = $.trim(stanza.root().find('show').text());
    parsed.status   = $.trim(stanza.root().find('status').text());
    parsed.priority = parseInt($.trim(stanza.root().find('priority').text()),10) || 0;
    parsed.frabjous_type = Frabjous.Presence;    
    return parsed;
  }
  
});