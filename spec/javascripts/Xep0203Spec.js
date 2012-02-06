describe("XEP-0203", function() {

  beforeEach(function() {
  });

  describe("when message received with delay", function(){
    it("should create a message object with delay", function(){
      parseStanza("<message id='13a' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body><delay xmlns='urn:xmpp:delay' from='capulet.com' stamp='2002-09-10T23:08:25Z'>Offline Storage</delay></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message,'13a');    
      var d = m.get('delay');
      
      expect(d.get('reason')).toEqual('Offline Storage');
      expect(d.get('stamp')).toEqualDate('2002-09-10T23:08:25Z');
      expect(d.get('from')).toBeJid('capulet.com');
    });
  });

});