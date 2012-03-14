describe("XEP-0203", function() {

  beforeEach(function() {
  });

  describe("when message received with delay", function(){
    it("should create a message object with delay", function(){
      parseStanza("<message id='13a' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body><delay xmlns='urn:xmpp:delay' from='capulet.com' stamp='2002-09-10T23:08:25+01:00'>Offline Storage</delay></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message,'13a');    
      var d = m.get('delay');
      
      expect(m.get('received_at')).toBeDate('2002-09-10T22:08:25Z');
      expect(d.get('reason')).toEqual('Offline Storage');
      expect(d.get('stamp')).toBeDate('2002-09-10T22:08:25Z');
      expect(d.get('from')).toBeJid('capulet.com');
    });
  });
  
  describe("when message received without delay", function(){
    it("should create a message object with no delay", function(){
      parseStanza("<message id='14a' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var m = Frabjous.Store.find(Frabjous.Message,'14a');    
      var d = m.get('delay');
      
      var now = new Date();
      var created_at = m.get('created_at');
      expect(created_at).toBeCloseTo(now);
      expect(m.get('received_at')).toBeDate(created_at);
      expect(m.get('delay')).toBeNull();
    });
  });

});