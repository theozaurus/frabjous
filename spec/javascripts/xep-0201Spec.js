describe("XEP-0201",function(){
  
  var klass = Frabjous.Thread;
  
  beforeEach(function(){
    Frabjous.Store.init();
  });
  
  describe("when a message is received", function(){
    it("should link to a thread if present", function(){
      var s = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>Of that tongue's utterance, yet I know the sound:</body><thread>sadfasdf</thread></message>");
      var m = Frabjous.Store.find(Frabjous.Message, s.id());
      
      var t = Frabjous.Store.find(klass, 'sadfasdf');
      expect(m.get('thread')).toEqualModel(t);
      expect(t.get('messages')).toEqualModelArray([m]);
    });
    
    it("should link to a parent_thread if present", function(){
      var s = parseStanza("<message to='romeo@example.net/orchard' from='juliet@example.com/balcony' id='asiwe8289ljfdalk' type='chat'><body>Art thou not Romeo, and a Montague?</body><thread parent='7edac73ab41e45c4aafa7b2d7b749080'>e0ffe42b28561960c6b12b944a092794b9683a38</thread></message>");
      var m = Frabjous.Store.find(Frabjous.Message, s.id());
      
      var t = Frabjous.Store.find(klass, 'e0ffe42b28561960c6b12b944a092794b9683a38');
      var p = Frabjous.Store.find(klass, '7edac73ab41e45c4aafa7b2d7b749080');
      expect(m.get('thread')).toEqualModel(t);
      expect(m.get('parent_thread')).toEqualModel(p);
      
      expect(t.get('messages')).toEqualModelArray([m]);
      
      expect(p.get('messages')).toEqualModelArray([]);
      expect(p.get('child_threads')).toEqualModelArray([t]);
    });
  });
  
  describe("when multiple messages are received", function(){
    it("messages should return them in the correct order" ,function(){
      var s1 = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>Art thou not Romeo and a Montague?</body><thread>drawgyavOg</thread></message>");
      var m1 = Frabjous.Store.find(Frabjous.Message,s1.id());

      var s2 = parseStanza("<message from='romeo@example.net' to='juliet@example.com/balcony' type='chat'><body>Neither, fair saint, if either thee dislike</body><thread>drawgyavOg</thread></message>");
      var m2 = Frabjous.Store.find(Frabjous.Message,s2.id());
      
      var t = Frabjous.Store.find(klass, 'drawgyavOg');

      expect(t.get('messages')).toEqualModelArray([m1,m2]);
    });
  });
  
});