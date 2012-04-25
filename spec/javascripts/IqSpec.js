describe("Iq", function() {

  var klass = Frabjous.Iq;

  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when received", function(){
    
    it("should no create an iq object", function(){
      // This is because we could receive IQ's for any number of reasons and we do not want to
      // Collect IQ's we don't recognise
      var s = parseStanza("<iq from='capulet.lit' to='juliet@capulet.lit/balcony' id='s2c1' type='get'></iq>");
      
      expect(Frabjous.Store).toNotHaveItem(Frabjous.Iq,"s2c1"); 
    });
    
  });

});
