//= require ember-data
//= require jquery
//= require ./contact

Frabjous.Message = DS.Model.extend({
  from:          DS.attr('jidString'),
  to:            DS.attr('jidString'),
  type:          DS.attr('string'),
  body:          DS.attr('string'),
  subject:       DS.attr('string'),
  thread:        DS.attr('string'),
  parent_thread: DS.attr('string'),
  contact:       DS.belongsTo('Frabjous.Contact'),
  didLoad: function(){
    var contact;
    var type              = Frabjous.Contact;
    var contact_id        = this.get('from').toString();
    var contact_client_id = Frabjous.Store.clientIdForId(type, contact_id);
    
    if( Ember.none(contact_client_id) ){
      // No contact exists, so create one
      Frabjous.Store.load(type,{jid: this.get('from'), _messages:[this.get('id')]});
      contact = Frabjous.Store.find(type,contact_id);
    }else{
      // Update contact
      contact = Frabjous.Store.find(type,contact_id);
      contact.get('_messages').addObject(this);
    }
    
    this.set('contact',contact);
  }
});

Frabjous.Contact.reopen({
  // Allows me to override the ordering in XEP-0203, I don't like this method
  _messages: DS.hasMany('Frabjous.Message'),
  messages: function(){ return this.get('_messages'); }.property('_messages')
});

Frabjous.Parser.register("Message", function(stanza){
  
  if( stanza.is_message() ){
    var parsed = {};
    parsed.id      = stanza.id();
    parsed.from    = stanza.from();
    parsed.to      = stanza.to();
    parsed.type    = stanza.type() || "normal";
    parsed.subject = stanza.root().find('subject').text();
    parsed.body    = stanza.root().find('body').text();
    
    parsed.thread        = stanza.root().find('thread').text();
    parsed.parent_thread = stanza.root().find('thread').attr('parent');
    
    parsed.frabjous_type = Frabjous.Message;
    
    return parsed;
  }
  
});