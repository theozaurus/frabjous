//= require ember-data

Frabjous.Contact = DS.Model.extend({
  primaryKey: 'jid',
  jid:        DS.attr('jidString')
});