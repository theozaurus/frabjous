//= require ember-data
//= require jquery

Frabjous.Message = DS.Model.extend({
  from:    DS.attr('jidString'),
  to:      DS.attr('jidString'),
  type:    DS.attr('string'),
  body:    DS.attr('string'),
  subject: DS.attr('string'),
});

Frabjous.Parser.register("Message", function($stanza){  
  var message_stanza = $stanza.find("message");
  
  if( message_stanza.length > 0){
    var $message_stanza = $(message_stanza);
    var parsed = {};
    
    parsed.from    = $message_stanza.attr('from');
    parsed.id      = $message_stanza.attr('id');
    parsed.to      = $message_stanza.attr('to');
    parsed.type    = $message_stanza.attr('type');
    parsed.subject = $message_stanza.find('subject').text();
    parsed.body    = $message_stanza.find('body').text();
    parsed.frabjous_type = Frabjous.Message;
    
    return parsed;
  }
  
});