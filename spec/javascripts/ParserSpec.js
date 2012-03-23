describe("Parser", function(){
  
  var subject = Frabjous.Parser;
  
  describe("handle", function(){
    
    it("should return the first created object", function(){
      var s = createStanza("<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>");
      
      var r = subject.handle(s);
      
      var e = Frabjous.Store.find(Frabjous.Message, s.id());
      expect(r).toBe(r);
    });
    
  });
  
});