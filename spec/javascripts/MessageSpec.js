describe("Message", function() {

  beforeEach(function() {
  });

  describe("when received", function(){
    it("should create a message object with id of message", function(){
      parseStanza("<message id='12a' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message,'12a');
      expect(m.get('body')).toEqual('hello there');
      expect(m.get('type')).toEqual('chat');
      expect(m.get('from')).toBeJid('alice@bar.com');
      expect(m.get('to')).toBeJid('bob@bar.com');
      expect(m.get('subject')).toEqual('');
    });
  });

});
