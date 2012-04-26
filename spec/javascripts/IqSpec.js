describe("Iq", function() {

  var klass = Frabjous.Iq;

  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when received", function(){
    
    it("should not create an iq object", function(){
      // This is because we could receive IQ's for any number of reasons and we do not want to
      // Collect IQ's we don't recognise
      var s = parseStanza("<iq from='capulet.lit' to='juliet@capulet.lit/balcony' id='s2c1' type='get'></iq>");
      
      expect(Frabjous.Store).toNotHaveItem(Frabjous.Iq,"s2c1"); 
    });
    
  });
  
  describe("callbacks", function(){
    it("when an unrecognised request comes in, send out service-unavailable", function(){
      new Mock(Frabjous.Connection);
      Frabjous.Connection.spies('send').passing_xml("<iq from='juliet@capulet.lit/balcony' to='capulet.lit' id='s2c1' type='error' xmlns='jabber:client'><magic xmlns='urn:xmpp:magic'/><error type='cancel'><service-unavailable xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></iq>");
      
      Frabjous.Connection.receive("<iq from='capulet.lit' to='juliet@capulet.lit/balcony' id='s2c1' type='get'><magic xmlns='urn:xmpp:magic'/></iq>");
    });
  });

});
