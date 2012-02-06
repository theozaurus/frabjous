//= require ember
//= require ember-data

Frabjous.Jid = Ember.Object.extend({
  jid: "",
  bare: function(){
    var m = this.get('_matches');
    return [m[0],m[1]].join("@");
  }.property('_matches'),
  node: function(){
    return this.get('_matches')[0];
  }.property('_matches'),
  domain: function(){
    return this.get('_matches')[1];
  }.property('_matches'),
  resource: function(){
    return this.get('_matches')[2];
  }.property('_matches'),
  _matches: function(){
    var matches = /^(([^@ ]+)@)?([^\/]+)(\/(.+))?$/.exec(this.get('jid'));
    return [matches[2],matches[3],matches[5]];
  }.property('jid'),
  toString: function(){
    var jid = this.get('jid');
    return Em.none(jid) ? "" : jid;
  }
});

DS.attr.transforms.jidString = {
  from: function(serialized) {
    return Frabjous.Jid.create({
      jid: serialized
    });
  },
  to: function(deserialized) {
    return Em.none(deserialized) ? null : deserialized.get('jid');
  }
};