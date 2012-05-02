//= require ember
//= require ember-data
//= require ./contact

Frabjous.Feature = Frabjous.Permanent.extend({
  var: DS.attr('string')
});

Frabjous.Identity = Frabjous.Permanent.extend({
  category: DS.attr('string'),
  type:     DS.attr('string'),
  name:     DS.attr('string')
});

Frabjous.Contact.reopen({
  name:       DS.attr('string'),
  node:       DS.attr('string'),
  items:      DS.hasMany('Frabjous.Contact'),
  features:   DS.hasMany('Frabjous.Feature',  {embedded: true}),
  identities: DS.hasMany('Frabjous.Identity', {embedded: true})
});

Frabjous.Parser.register("XEP-0030 items", function(stanza){
  var query = stanza.root().find("query[xmlns='http://jabber.org/protocol/disco#items']");
  if( stanza.type() == "result" && stanza.is_iq && query.length > 0 ){
    
    // Each item is a new contact
    items = query.find('item').map(function(i,e){
      $e = $(e);
      return {
        frabjous_type: Frabjous.Contact,
        id:            $e.attr('jid'),
        jid:           $e.attr('jid'),
        name:          $e.attr('name'),
        node:          $e.attr('node')
      };
    }).toArray();
        
    // Finally, the place where the query came from is a contact, that is linked to the items
    items.push({
      frabjous_type: Frabjous.Contact,
      id:            stanza.from(),
      jid:           stanza.from(),
      items:         $.map(items,function(e){ return e.jid; })
    });
        
    return items;
  }
});

Frabjous.Parser.register("XEP-0030 info", function(stanza){
  var query = stanza.root().find("query[xmlns='http://jabber.org/protocol/disco#info']");
  if( stanza.type() == "result" && stanza.is_iq && query.length > 0 ){
    
    identities = query.find('identity').map(function(i,e){
      $e = $(e);
      return {
        id:       [stanza.from(), $e.attr('category'), $e.attr('type')].join(" "),
        category: $e.attr('category'),
        type:     $e.attr('type'),
        name:     $e.attr('name')
      };
    }).toArray();
    
    features = query.find('feature').map(function(i,e){
      $e = $(e);
      return {
        id:  [stanza.from(), $e.attr('var')].join(" "),
        var: $e.attr('var')
      };
    }).toArray();
    
    return {
      frabjous_type: Frabjous.Contact,
      id:         stanza.from(),
      jid:        stanza.from(),
      identities: identities,
      features:   features
    };
  }
});