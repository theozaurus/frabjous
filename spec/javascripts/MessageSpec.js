describe("Message", function() {

  beforeEach(function() {
  });

  describe("when received", function(){
    it("should create a message object", function(){
      var s = parseStanza("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(m.get('body')).toEqual('hello there');
      expect(m.get('type')).toEqual('chat');
      expect(m.get('from')).toBeJid('alice@bar.com');
      expect(m.get('to')).toBeJid('bob@bar.com');
      expect(m.get('subject')).toEqual('');
    });
    
    it("should default the type to normal", function(){
      var s = parseStanza("<message to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(m.get('type')).toEqual('normal');
    });
    
    it("should record thread information", function(){
      var s = parseStanza("<message to='bob@bar.com' from='alice@bar.com'><body>hello there</body><thread>123</thread></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(m.get('thread')).toEqual('123');
    });
    
    it("should record parent thread information", function(){
      var s = parseStanza("<message to='bob@bar.com' from='alice@bar.com'><body>hello there</body><thread parent='ABC'>123</thread></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(m.get('thread')).toEqual('123');
      expect(m.get('parent_thread')).toEqual('ABC');
    });
  });

});
