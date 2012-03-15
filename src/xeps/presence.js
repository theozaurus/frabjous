//= require ember
//= require ember-data

Frabjous.Presence = DS.Model.extend({
  from:     DS.attr('jidString'),
  to:       DS.attr('jidString'),
  type:     DS.attr('string'),
  status:   DS.attr('string'),
  show:     DS.attr('string'),
  subject:  DS.attr('string'),
  priority: DS.attr('number')
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