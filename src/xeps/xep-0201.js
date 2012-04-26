//= require ./message

Frabjous.Thread = Frabjous.Permanent.extend({
  parent_id:        DS.attr('string'),
  child_threads:    DS.hasMany('Frabjous.Thread'),
  _messages:        DS.hasMany('Frabjous.Message'),
  messages:         function(){ return this.get('_messages'); }.property('_messages.@each'),
  hasParent:        function(){ return !Ember.none(this.get('parent_id'));}.property('parent_id')
});

Frabjous.Message.reopen({
  thread:        DS.belongsTo('Frabjous.Thread'),
  parent_thread: DS.belongsTo('Frabjous.Thread'),
  _load_thread: function(){
    var thread;
    var type      = Frabjous.Thread;
    var id        = this.get('thread_id');
    var parent_id = this.get('parent_thread_id');
    var client_id = Frabjous.Store.clientIdForId(type,id);

    if( Ember.none(client_id) ){
      // Create
      Frabjous.Log.debug("Creating Frabjous.Thread " + id);
      Frabjous.Store.load_and_find(type,{id: id, _messages:[this.get('id')], parent_id: parent_id});
      thread = Frabjous.Store.find(type,id);
    }else{
      // Update
      Frabjous.Log.debug("Updating Frabjous.Thread " + id);
      thread = Frabjous.Store.find(type,id);
      thread.get('_messages').addObject(this);
      if( !Ember.none(parent_id) ){
        thread.set('parent_id',parent_id);
      }
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
      Frabjous.Log.debug("Creating parent Frabjous.Thread " + id);
      Frabjous.Store.load_and_find(type,{id: id, child_threads: [this.get('thread').get('id')]});
      thread = Frabjous.Store.find(type,id);
    }else{
      // Update
      Frabjous.Log.debug("Updating parent Frabjous.Thread " + id);
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