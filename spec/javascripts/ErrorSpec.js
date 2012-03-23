describe("Error", function() {

  var klass = Frabjous.Error;

  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when received", function(){
    it("should create an object with an error", function(){
      var s = parseStanza("<presence from='characters@muc.example.com/JulieC' id='y2bs71v4' to='juliet@im.example.com/balcony' type='error'><error type='auth'><forbidden xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></presence>");
      
      var o = Frabjous.Store.find(Frabjous.Presence, s.id());
      var e = o.get('error');

      expect(e.get('type')).toEqual('auth');
      expect(e.get('condition')).toEqual('forbidden');
      expect(e.get('condition_payload')).toBeNull();
      expect(e.get('text')).toBeNull();
      expect(e.get('by')).toBeNull();
    });
    
    it("should pick out the text if it exists", function(){
      var s = parseStanza("<presence from='characters@muc.example.com/JulieC' id='y2bs71v4' to='juliet@im.example.com/balcony' type='error'><error type='auth'><forbidden xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/><text xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>You are not allowed to do this</text></error></presence>");
      
      var o = Frabjous.Store.find(Frabjous.Presence, s.id());
      var e = o.get('error');
      
      expect(e.get('type')).toEqual('auth');
      expect(e.get('condition')).toEqual('forbidden');
      expect(e.get('condition_payload')).toBeNull();
      expect(e.get('text')).toEqual('You are not allowed to do this');
      expect(e.get('by')).toBeNull();
    });
    
    it("should pick out by if it exists", function(){
      var s = parseStanza("<message from='romeo@example.net' id='sj2b371v' to='juliet@im.example.com/churchyard' type='error'><error by='example.net' type='cancel'><gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>xmpp:romeo@afterlife.example.net</gone></error></message>");
      
      var o = Frabjous.Store.find(Frabjous.Message, s.id());
      var e = o.get('error');

      expect(e.get('type')).toEqual('cancel');
      expect(e.get('condition')).toEqual('gone');
      expect(e.get('condition_payload')).toEqual('xmpp:romeo@afterlife.example.net');
      expect(e.get('text')).toBeNull();
      expect(e.get('by')).toEqual('example.net');
    });
    
    it("should set has_error property on object", function(){
      var s = parseStanza("<message from='romeo@example.net' id='sj2b371v' to='juliet@im.example.com/churchyard' type='error'><error by='example.net' type='cancel'><gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>xmpp:romeo@afterlife.example.net</gone></error></message>");
      
      var o = Frabjous.Store.find(Frabjous.Message, s.id());
      
      expect(o.get('has_error')).toBeTrue();
    });
    
    it("should not set has_error property on object if there is no error", function(){
      var s = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>My ears have not yet drunk a hundred words</body></message>");
      
      var o = Frabjous.Store.find(Frabjous.Message, s.id());
      
      expect(o.get('has_error')).toBeFalse();
    });
    
    it("should set is_success property on object", function(){
      var s = parseStanza("<message from='romeo@example.net' id='sj2b371v' to='juliet@im.example.com/churchyard' type='error'><error by='example.net' type='cancel'><gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>xmpp:romeo@afterlife.example.net</gone></error></message>");
      
      var o = Frabjous.Store.find(Frabjous.Message, s.id());
      
      expect(o.get('is_success')).toBeFalse();
    });
    
    it("should not set has_error property on object if there is no error", function(){
      var s = parseStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>My ears have not yet drunk a hundred words</body></message>");
      
      var o = Frabjous.Store.find(Frabjous.Message, s.id());
      
      expect(o.get('is_success')).toBeTrue();
    });
  });

});
