describe("Connection",function(){
  
  var subject = Frabjous.Connection;
  
  describe("receive",function(){
    it("should call the parser",function(){
      new Mock(Frabjous.Parser);
      Frabjous.Parser.expects('handle').returns(new Frabjous.Message({}));
      
      subject.receive("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
    });
    
    it("should call the callback list with proper arguments", function(){
      var object = new Frabjous.Message({});
      
      new Mock(Frabjous.Parser);
      Frabjous.Parser.stubs('handle').returns(new Frabjous.Message({}));
      
      var callbacks = Frabjous.Connection.get('callbacks');
      new Mock(callbacks);
      
      callbacks.expects('handle').passing("a",true,object);
      
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
    
    it("should add any callbacks to the correct id", function(){
      new Mock(subject);
      subject.stubs('_send_now');
      
      var callback = {completed: function(){}};
      
      subject.send("<message id='33' type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>", callback);
      
      expect(subject.callbacks.find('33')).toIncludeCallback(callback);
    });
    
    it("should pass stanza to _send_now", function(){
      var s = "<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>";
      
      new Mock(subject);
      subject.expects('_send_now').passing(function(a){ return a[0].toString() == s; });
      
      subject.send(s);
    });
  });
  
  afterEach(function(){
    Mock.teardown_all();
  });
  
});