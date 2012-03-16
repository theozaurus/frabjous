//= require ember
//= require ember-data

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
    var type              = Frabjous.Contact;
    var contact_id        = this.get('from').toString();
    var contact_client_id = Frabjous.Store.clientIdForId(type, contact_id);
    
    if( Ember.none(contact_client_id) ){
      // No contact exists, so create one
      Frabjous.Store.load(type,{jid: this.get('from'), _presence_history:[this.get('id')]});
      contact = Frabjous.Store.find(type,contact_id);
    }else{
      // Update contact
      contact = Frabjous.Store.find(type,contact_id);
      contact.get('_presence_history').addObject(this);
    }
    
    this.set('contact',contact);
  }
});

Frabjous.Contact.reopen({
  // Allows me to override the ordering in XEP-0203, I don't like this method
  _presence_history: DS.hasMany('Frabjous.Presence'),
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
    parsed.show     = stanza.root().find('show').text();
    parsed.status   = stanza.root().find('status').text();
    parsed.priority = parseInt(stanza.root().find('priority').text(),10) || 0;
    parsed.frabjous_type = Frabjous.Presence;    
    return parsed;
  }
  
});