describe("Frabjous.Stanza", function(){
  
  var subject = Frabjous.Stanza;
  
  describe("root", function(){
    
    it("should return a jquery dom object when a string is passed in", function(){
      var s = new subject("<message from='juliet@im.example.com/churchyard' to='romeo@example.net' type='chat'><body>Thy lips are warm.</body></message>");
      expect(s.root().constructor).toBe($);
    });
    
    it("should return a jquery object when a dom object is passed in", function(){
      var d = $.parseXML("<message from='juliet@im.example.com/churchyard' to='romeo@example.net' type='chat'><body>Thy lips are warm.</body></message>");
      var s = new subject(d);
      expect(s.root().constructor).toBe($);
    });
    
    it("should have access to the root of the document", function(){
      var s = new subject("<message from='juliet@im.example.com/churchyard' to='romeo@example.net' type='chat'><body>Thy lips are warm.</body></message>");
      expect(s.root().attr('type')).toEqual('chat');
    });
    
  });
  
  describe("id", function(){
    it("should return id of stanza if present", function(){
      var s = new subject("<iq id='123123'></iq>");
      expect(s.id()).toEqual("123123");
    });
    
    it("should create id if stanza does not have one", function(){
      var s = new subject("<message></message>");
      expect(s.id()).toMatch(/generated-\d+/);
    });
    
    it("should create new id for future stanzas that do not have one", function(){
      var s1 = new subject("<message></message>");
      var id1 = s1.id();
      var s2 = new subject("<message></message>");
      var id2 = s2.id();
      var s3 = new subject("<message></message>");
      var id3 = s3.id();
      expect(id1).not.toEqual(id2);
      expect(id1).not.toEqual(id3);
      expect(id2).not.toEqual(id3);
    });
  });
  
  describe("from", function(){
    it("should return from of stanza if present", function(){
      var s = new subject("<message from='frabjous'></message>");
      expect(s.from()).toEqual('frabjous');
    });
    
    it("should return undefined if from not present", function(){
      var s = new subject("<message></message>");
      expect(s.from()).toBeUndefined();
    });
  });
  
  describe("to", function(){
    it("should return to of stanza if present", function(){
      var s = new subject("<message to='frabjous'></message>");
      expect(s.to()).toEqual('frabjous');
    });
    
    it("should return undefined if to not present", function(){
      var s = new subject("<message></message>");
      expect(s.to()).toBeUndefined();
    });
  });
  
  describe("type", function(){
    it("should return type of stanza if present", function(){
      var s = new subject("<message type='frabjous'></message>");
      expect(s.type()).toEqual('frabjous');
    });
    
    it("should return undefined if type not present", function(){
      var s = new subject("<message></message>");
      expect(s.type()).toBeUndefined();
    });
  });
  
  describe("is_message", function(){
    
    it("should return false if not a message stanza", function(){
      var s = new subject("<presence from='romeo@example.net/orchard'><status>Wooing Juliet</status></presence>");
      expect(s.is_message()).toBeFalse();
    });
    
    it("should return true if a message stanza", function(){
      var s = new subject("<message from='juliet@im.example.com/churchyard' to='romeo@example.net' type='chat'><body>Thy lips are warm.</body></message>");
      expect(s.is_message()).toBeTrue();
    });
    
  });
  
  describe("is_presence", function(){
    
    it("should return false if not a presence stanza", function(){
      var s = new subject("<iq from='juliet@im.example.com/balcony' to='im.example.com' type='subscribe'><ping xmlns='urn:xmpp:ping'/></iq>");
      expect(s.is_presence()).toBeFalse();
    });
    
    it("should return true if a presence stanza", function(){
      var s = new subject("<presence from='romeo@example.net/orchard'><status>Wooing Juliet</status></presence>");
      expect(s.is_presence()).toBeTrue();
    });
    
  });
  
  describe("is_iq", function(){
    
    it("should return false if not an iq stanza", function(){
      var s = new subject("<presence from='romeo@example.net/orchard'><status>Wooing Juliet</status></presence>");
      expect(s.is_iq()).toBeFalse();
    });
    
    it("should return true if an iq stanza", function(){
      var s = new subject("<iq from='juliet@im.example.com/balcony' to='im.example.com' type='subscribe'><ping xmlns='urn:xmpp:ping'/></iq>");
      expect(s.is_iq()).toBeTrue();
    });
    
  });
  
});