describe("Parser", function(){
  
  var subject = Frabjous.Parser;
  
  beforeEach(function(){
    Frabjous.Store.init();
  });
  
  describe("handle", function(){
    
    it("should return the first created object", function(){
      var s = createStanza("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var r = subject.handle(s);
      
      var e = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(r).toBe(r);
    });
    
    it("should create an object", function(){
      var s = createStanza("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      subject.handle(s);
      
      var e = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(e).toBeDefined();
    });
    
    it("if an error is received and an object already exists it should just add an error", function(){
      var request = createStanza("<message from='romeo@montague.net/orchard' id='ud7n1f4h' to='bar@example.org' type='chat'><body>yt?</body></message>");
      var response = createStanza("<message from='bar@example.org' to='romeo@montague.net/orchard' id='ud7n1f4h' type='error'><error type='cancel'><remote-server-not-found xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></message>");
      
      subject.handle(request);
      subject.handle(response);
      
      var o = Frabjous.Store.find(Frabjous.Message, request.id());
      
      expect(o.get('from')).toBeJid('romeo@montague.net/orchard'); // The original sender
      expect(o.get('to')).toBeJid('bar@example.org');              // The original recipient
      
      var error = o.get('error');
      expect(error).toBeDefined();
      expect(error.get('condition')).toEqual('remote-server-not-found');
    });
    
    it("should not create an object if store equals false", function(){
      var request = createStanza("<message id='asdf123' type='chat'><body>foo</body></message>");
      
      // Add in a handler that will add store false to object
      Frabjous.Parser.handlers().Temp = {
        name: "Temp",
        parse: function(){
          return {
            id:    "asdf123",
            store: false
          };
        }
      };
      
      subject.handle(request);

      // Remove temp handler
      delete Frabjous.Parser.handlers().Temp;

      expect(Frabjous.Store).toNotHaveItem(Frabjous.Message,"asdf123");
    });
    
  });
  
});