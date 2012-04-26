// This class is used when we do not want to save the parsed data
// but do need to perform some basic functions

Frabjous.Temporary = Ember.Object.extend({
  is_temporary: true,
  is_permanent: false
});