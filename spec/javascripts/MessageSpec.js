describe("Message", function() {

  var klass = Frabjous.Message;

  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when received", function(){
    it("should create a message object", function(){
      var s = parseStanza("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.find(klass, s.id());
      expect(m.get('body')).toEqual('hello there');
      expect(m.get('type')).toEqual('chat');
      expect(m.get('from')).toBeJid('alice@bar.com');
      expect(m.get('to')).toBeJid('bob@bar.com');
      expect(m.get('subject')).toEqual('');
    });
    
    it("should default the type to normal", function(){
      var s = parseStanza("<message to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.find(klass, s.id());
      expect(m.get('type')).toEqual('normal');
    });
    
    it("should record thread information", function(){
      var s = parseStanza("<message to='bob@bar.com' from='alice@bar.com'><body>hello there</body><thread>123</thread></message>");
      
      var m = Frabjous.Store.find(klass, s.id());
      expect(m.get('thread')).toEqual('123');
    });
    
    it("should record parent thread information", function(){
      var s = parseStanza("<message to='bob@bar.com' from='alice@bar.com'><body>hello there</body><thread parent='ABC'>123</thread></message>");
      
      var m = Frabjous.Store.find(klass, s.id());
      expect(m.get('thread')).toEqual('123');
      expect(m.get('parent_thread')).toEqual('ABC');
    });
    
    it("should link to a contact", function(){
      var s = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>My ears have not yet drunk a hundred words</body></message>");
      
      var m = Frabjous.Store.find(klass, s.id());
      var c = Frabjous.Store.find(Frabjous.Contact,'juliet@example.com/balcony');
      
      expect(m).not.toBeDirty();
      expect(m.get('contact')).toEqualModel(c);
      expect(c).not.toBeDirty();
      expect(c.get('messages_sent')).toEqualModelArray([m]);
    });
    
    it("should build has many to contact", function(){
      var s1 = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>Of that tongue's utterance, yet I know the sound:</body></message>");
      var m1 = Frabjous.Store.find(klass, s1.id());
      
      var s2 = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>Art thou not Romeo, and a Montague?</body></message>");
      var m2 = Frabjous.Store.find(klass, s2.id());
      
      var c = Frabjous.Store.find(Frabjous.Contact,'juliet@example.com/balcony');
      
      expect(m1.get('contact')).toEqualModel(c);
      expect(m2.get('contact')).toEqualModel(c);
      expect(c.get('messages_sent')).toEqualModelArray([m1,m2]);
    });
    
  });

});
