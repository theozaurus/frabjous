//= require ember
//= require ember-data

Frabjous.Presence = DS.Model.extend({
  from:    DS.attr('jidString'),
  to:      DS.attr('jidString'),
  type:    DS.attr('string'),
  status:  DS.attr('string'),
  show:    DS.attr('string'),
  subject: DS.attr('string')
});
