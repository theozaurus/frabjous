//= require ember-data
//= require jquery
//= require ./contact

Frabjous.Message = Frabjous.Permanent.extend({
  from:             DS.attr('jidString'),
  to:               DS.attr('jidString'),
  type:             DS.attr('string'),
  body:             DS.attr('string'),
  subject:          DS.attr('string'),
  thread_id:        DS.attr('string'),
  parent_thread_id: DS.attr('string'),
  contact_to:       DS.belongsTo('Frabjous.Contact'),
  contact_from:     DS.belongsTo('Frabjous.Contact'),
  _load_contact: function(field){
    var contact;
    var id             = this.get(field).toString();
    var type           = Frabjous.Contact;
    var client_id      = Frabjous.Store.clientIdForId(type, id);
    var messages_field = '_messages_' + field;
    var local_field    = 'contact_' + field;
    
    if( Ember.none(client_id) ){
      // No contact exists, so create one
      Frabjous.log.debug("Creating Frabjous.Contact " + id);
      var hash = {jid: id};
      hash[messages_field] = [this.get('id')];
      Frabjous.Store.load_and_find(type,hash);
      contact = Frabjous.Store.find(type,id);
    }else{
      // Update contact
      Frabjous.log.debug("Updating Frabjous.Contact " + id);
      contact = Frabjous.Store.find(type,id);
      contact.get(messages_field).addObject(this);
    }
    
    this.set(local_field,contact);
  },
  didLoad: function(){
    this._load_contact('from');
    this._load_contact('to');
  }
});

Frabjous.Contact.reopen({
  // Allows me to override the ordering in XEP-0203, I don't like this method
  _messages_from: DS.hasMany('Frabjous.Message'),
  messages_from: function(){ return this.get('_messages_from'); }.property('_messages_from.@each'),
  _messages_to: DS.hasMany('Frabjous.Message'),
  messages_to: function(){ return this.get('_messages_to'); }.property('_messages_to.@each'),
  message: function(body,opts){
    opts = opts || {};
    var to = this.get('jid');
    
    var attributes = {};
    attributes.to = to;
    attributes.from = opts.from || Frabjous.Connection.get('jid');
    if(opts.id){ attributes.id = opts.id; }
    if(opts.type){ attributes.type = opts.type; }
    
    var xml = new Frabjous.XML.builder("message", attributes);
    xml.c("body", {}, body);
    if(opts.subject){ xml.c("subject", {}, opts.subject); }
    if(opts.thread){ xml.c("thread", {}, opts.thread); }
    
    return Frabjous.Connection.send(xml.toString(), opts.callbacks);
  }
});

Frabjous.Parser.register("Message", function(stanza){
  
  if( stanza.is_message() ){
    var parsed = {};
    parsed.id      = stanza.id();
    parsed.from    = stanza.from();
    parsed.to      = stanza.to();
    parsed.type    = stanza.type() || "normal";
    parsed.subject = $.trim(stanza.root().find('subject').text());
    parsed.body    = $.trim(stanza.root().find('body').text());
    
    parsed.thread_id        = $.trim(stanza.root().find('thread').text());
    parsed.parent_thread_id = stanza.root().find('thread').attr('parent');
    
    parsed.frabjous_type = Frabjous.Message;
    
    return parsed;
  }
  
});