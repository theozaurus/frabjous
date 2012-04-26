//= require ember-data

Frabjous.Contact = Frabjous.Permanent.extend({
  primaryKey: 'jid',
  jid:        DS.attr('jidString')
});