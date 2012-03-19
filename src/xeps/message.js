//= require ember-data
//= require jquery
//= require ./contact

Frabjous.Message = DS.Model.extend({
  from:             DS.attr('jidString'),
  to:               DS.attr('jidString'),
  type:             DS.attr('string'),
  body:             DS.attr('string'),
  subject:          DS.attr('string'),
  thread_id:        DS.attr('string'),
  parent_thread_id: DS.attr('string'),
  contact:          DS.belongsTo('Frabjous.Contact'),
  _load_contact: function(){
    var contact;
    var type      = Frabjous.Contact;
    var id        = this.get('from').toString();
    var client_id = Frabjous.Store.clientIdForId(type, id);
    
    if( Ember.none(client_id) ){
      // No contact exists, so create one
      Frabjous.Store.load(type,{jid: id, _messages_sent:[this.get('id')]});
      contact = Frabjous.Store.find(type,id);
    }else{
      // Update contact
      contact = Frabjous.Store.find(type,id);
      contact.get('_messages_sent').addObject(this);
    }
    
    this.set('contact',contact);
  },
  didLoad: function(){
    this._load_contact();
  }
});

Frabjous.Contact.reopen({
  // Allows me to override the ordering in XEP-0203, I don't like this method
  _messages_sent: DS.hasMany('Frabjous.Message'),
  messages_sent: function(){ return this.get('_messages_sent'); }.property('_messages_sent')
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
    
    parsed.thread_id        = stanza.root().find('thread').text();
    parsed.parent_thread_id = stanza.root().find('thread').attr('parent');
    
    parsed.frabjous_type = Frabjous.Message;
    
    return parsed;
  }
  
});