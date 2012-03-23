//= require ember
//= require ember-data

Frabjous.Store = DS.Store.create({
  revision: 3,
  load_and_find: function(type,hash){
    this.load(type,hash);
    return this.find(type,hash.id);
  }
});