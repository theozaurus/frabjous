//= require ember-data
//= require jquery

Frabjous.Iq = Frabjous.Permanent.extend({
  id:               DS.attr('string'),
  from:             DS.attr('jidString'),
  to:               DS.attr('jidString'),
  type:             DS.attr('string'),  
  contact_to:       DS.belongsTo('Frabjous.Contact'),
  contact_from:     DS.belongsTo('Frabjous.Contact'),
  _load_contact: function(field){
    var contact;
    var id          = this.get(field).toString();
    var type        = Frabjous.Contact;
    var client_id   = Frabjous.Store.clientIdForId(type, id);
    var iqs_field   = '_iqs_' + field;
    var local_field = 'contact_' + field;
    
    if( Ember.none(client_id) ){
      // No contact exists, so create one
      Frabjous.log.debug("Creating Frabjous.Contact " + id);
      var hash = {jid: id};
      hash[iqs_field] = [this.get('id')];
      Frabjous.Store.load_and_find(type,hash);
      contact = Frabjous.Store.find(type,id);
    }else{
      // Update contact
      Frabjous.log.debug("Updating Frabjous.Contact " + id);
      contact = Frabjous.Store.find(type,id);
      contact.get(iqs_field).addObject(this);
    }
    
    this.set(local_field,contact);
  },
  didLoad: function(){
    this._load_contact('from');
    this._load_contact('to');
  }
});

Frabjous.Parser.register("Iq", function(stanza){
  
  if( stanza.is_iq() ){
    var parsed = {};
    parsed.id      = stanza.id();
    parsed.from    = stanza.from();
    parsed.to      = stanza.to();
    parsed.type    = stanza.type();
    parsed.store   = false;
    
    parsed.frabjous_type = Frabjous.Iq;
    
    return parsed;
  }
  
});