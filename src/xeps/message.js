//= require ember-data
//= require jquery

Frabjous.Message = DS.Model.extend({
  from:    DS.attr('jidString'),
  to:      DS.attr('jidString'),
  type:    DS.attr('string'),
  body:    DS.attr('string'),
  subject: DS.attr('string'),
});

Frabjous.Parser.register("Message", function(stanza){
  
  if( stanza.is_message() ){
    var parsed = {};
    parsed.id      = stanza.id();
    parsed.from    = stanza.from();
    parsed.to      = stanza.to();
    parsed.type    = stanza.type();
    parsed.subject = stanza.root().find('subject').text();
    parsed.body    = stanza.root().find('body').text();
    parsed.frabjous_type = Frabjous.Message;
    
    return parsed;
  }
  
});