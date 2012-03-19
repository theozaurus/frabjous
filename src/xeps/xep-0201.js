//= require ./message

Frabjous.Thread = DS.Model.extend({
  child_threads: DS.hasMany('Frabjous.Thread'),
  _messages:     DS.hasMany('Frabjous.Message'),
  messages:      function(){ return this.get('_messages'); }.property('_messages'),
});

Frabjous.Message.reopen({
  thread:        DS.belongsTo('Frabjous.Thread'),
  parent_thread: DS.belongsTo('Frabjous.Thread'),
  _load_thread: function(){
    var thread;
    var type      = Frabjous.Thread;
    var id        = this.get('thread_id');
    var client_id = Frabjous.Store.clientIdForId(type,id);

    if( Ember.none(client_id) ){
      // Create
      Frabjous.Store.load(type,{id: id, _messages:[this.get('id')]});
      thread = Frabjous.Store.find(type,id);
    }else{
      // Update
      thread = Frabjous.Store.find(type,id);
      thread.get('_messages').addObject(this);
    }
    this.set('thread', thread);
  },
  _load_parent_thread: function(){
    var thread;
    var type      = Frabjous.Thread;
    var id        = this.get('parent_thread_id');
    var client_id = Frabjous.Store.clientIdForId(type, id);

    if( Ember.none(client_id) ){
      // Create
      Frabjous.Store.load(type,{id: id, child_threads: [this.get('thread').get('id')]});
      thread = Frabjous.Store.find(type,id);
    }else{
      // Update
      thread = Frabjous.Store.find(type,id);
      thread.get('child_threads').addObject(this.get('thread'));
    }
    this.set('parent_thread', thread);
  },
  didLoad: function(){
    this._super();
    if(!Ember.empty(this.get('thread_id'))){
      this._load_thread();
      if(!Ember.empty(this.get('parent_thread_id'))){
        this._load_parent_thread();
      }
    }
  }
});