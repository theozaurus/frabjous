//= require ember-data

// This class is used when we want to save the parsed data
Frabjous.Permanent = DS.Model.extend({
  is_temporary: false,
  is_permanent: true
});
