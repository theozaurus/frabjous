describe("Message", function() {

  beforeEach(function() {
  });

  describe("when received", function(){
    it("should create a message object", function(){
      parseStanza("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.findAll(Frabjous.Message).get('lastObject');
      expect(m.get('body')).toEqual('hello there');
      expect(m.get('type')).toEqual('chat');
      expect(m.get('from')).toBeJid('alice@bar.com');
      expect(m.get('to')).toBeJid('bob@bar.com');
      expect(m.get('subject')).toEqual('');
    });
    
    it("should create a message object with id of message if present", function(){
      parseStanza("<message id='1212' type='chat' to='bob@bar.com' from='alice@bar.com'><body>Handy!</body></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message,'1212');
      expect(m.get('body')).toEqual('Handy!');
      expect(m.get('type')).toEqual('chat');
      expect(m.get('from')).toBeJid('alice@bar.com');
      expect(m.get('to')).toBeJid('bob@bar.com');
      expect(m.get('subject')).toEqual('');
    });
  });

});
