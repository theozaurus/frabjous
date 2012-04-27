describe("Connection",function(){
  
  var subject = Frabjous.Connection;
  
  describe("receive",function(){
    it("should call the parser",function(){
      new Mock(Frabjous.Parser);
      Frabjous.Parser.expects('handle').returns(new Frabjous.Message({}));
      
      subject.receive("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
    });
    
    it("should pass the unmodified stanza to _receive_raw", function(){
      var stanza = "<message id='a' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>";
      
      new Mock(subject);
      subject.expects('_receive_raw').passing(stanza);
      
      subject.receive(stanza);
    });
    
    it("should call the callback list with proper arguments", function(){
      var object = {special_object: true, get: function(thing){return thing == "is_success";}};
      
      new Mock(Frabjous.Parser);
      Frabjous.Parser.stubs('handle').returns(object);
      
      var callbacks = Frabjous.Connection.get('callbacks');
      new Mock(callbacks);
      
      callbacks.expects('handle').passing(true,object);
      
      subject.receive("<message id='a' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
    });
  });
  
  describe("send",function(){
    it("should call the parser",function(){
      new Mock(Frabjous.Parser);
      Frabjous.Parser.expects('handle');
      new Mock(subject);
      subject.stubs('_send_now');
      
      subject.send("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
    });
    
    it("should add any callbacks with id matching", function(){
      new Mock(subject);
      subject.stubs('_send_now');
      
      var ran;
      var callback = {completed: function(){ran=true;}};
      
      subject.send("<message id='ud7n1f4h' from='romeo@montague.net/orchard' to='bar@example.org' type='chat'><body>yt?</body></message>", callback);
      
      expect(ran).toBeUndefined();
      
      subject.receive("<message id='34' type='chat' to='romeo@montague.net/orchard' from='bar@example.org'><body>Why hello</body></message>");
      
      expect(ran).toBeUndefined();
      
      subject.receive("<message id='ud7n1f4h' from='bar@example.org' to='romeo@montague.net/orchard' type='error'><error type='cancel'><remote-server-not-found xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></message>");
      
      expect(ran).toBeTrue();
    });
    
    it("should pass stanza to _send_now", function(){
      var s = "<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>";
      
      new Mock(subject);
      subject.expects('_send_now').passing(function(a){ return a[0].toString() == s; });
      
      subject.send(s);
    });
    
    it("should return the primary object created", function(){
      new Mock(subject);
      subject.stubs('_send_now');
      
      var s = "<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>";
      var m = subject.send(s);
      
      expect(m.get('body')).toEqual('hello there');
    });
  });
  
});