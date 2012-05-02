describe("XEP-0030", function(){
  
  beforeEach(function(){
    Frabjous.Store.init();
  });
  
  describe("http://jabber.org/protocol/disco#items", function(){
    
    describe("parsing", function(){
      
      var stanza;
      
      beforeEach(function(){
        stanza = "<iq type='result' from='juliet@capulet.com' to='shakespeare.lit' id='items2'><query xmlns='http://jabber.org/protocol/disco#items'><item jid='juliet@capulet.com/balcony'/><item jid='juliet@capulet.com/chamber'/></query></iq>";
      });
      
      it("should create a contact", function(){
        processStanza(stanza);
        
        var c = Frabjous.Store.find(Frabjous.Contact, "juliet@capulet.com");
        
        expect(c.get('jid')).toBeJid("juliet@capulet.com");
      });
      
      it("should create further contacts as a list", function(){
        processStanza(stanza);
        
        var c = Frabjous.Store.find(Frabjous.Contact, "juliet@capulet.com");
        var items = c.get('items');
        
        expect(c.get('items').get('length')).toEqual(2);
        
        var i0 = c.get('items').objectAt(0);
        var i1 = c.get('items').objectAt(1);
        
        expect(i0.get('jid')).toBeJid("juliet@capulet.com/balcony");
        expect(i1.get('jid')).toBeJid("juliet@capulet.com/chamber");
      });
      
      it("should not send out a reply", function(){
        new Mock(Frabjous.Connection);
        Frabjous.Connection.expects('send').never();
        
        Frabjous.Connection.receive(stanza);
      });
      
    });
    
  });
  
  describe("http://jabber.org/protocol/disco#info", function(){
    
    describe("parsing",function(){
      
      var stanza;
      
      beforeEach(function(){
        stanza = "<iq type='result' from='plays.shakespeare.lit' to='romeo@montague.net/orchard' id='info1'><query xmlns='http://jabber.org/protocol/disco#info'><identity category='conference' type='text' name='Play-Specific Chatrooms'/><identity category='directory' type='chatroom' name='Play-Specific Chatrooms'/><feature var='http://jabber.org/protocol/disco#info'/><feature var='http://jabber.org/protocol/disco#items'/><feature var='http://jabber.org/protocol/muc'/><feature var='jabber:iq:register'/><feature var='jabber:iq:search'/><feature var='jabber:iq:time'/><feature var='jabber:iq:version'/></query></iq>";
      });
      
      it("should create a contact", function(){
        processStanza(stanza);
        
        var c = Frabjous.Store.find(Frabjous.Contact, "plays.shakespeare.lit");
        
        expect(c.get('jid')).toBeJid("plays.shakespeare.lit");
      });
      
      it("should add features", function(){
        processStanza(stanza);
        
        var c = Frabjous.Store.find(Frabjous.Contact, "plays.shakespeare.lit");
        var features = c.get('features');
        
        expect(features.get('length')).toEqual(7);
        
        expect(features.objectAt(0)).toBeFeature({var: "http://jabber.org/protocol/disco#info"});
        expect(features.objectAt(1)).toBeFeature({var: "http://jabber.org/protocol/disco#items"});
        expect(features.objectAt(2)).toBeFeature({var: "http://jabber.org/protocol/muc"});
        expect(features.objectAt(3)).toBeFeature({var: "jabber:iq:register"});
        expect(features.objectAt(4)).toBeFeature({var: "jabber:iq:search"});
        expect(features.objectAt(5)).toBeFeature({var: "jabber:iq:time"});
        expect(features.objectAt(6)).toBeFeature({var: "jabber:iq:version"});
      });
      
      it("should add identities", function(){
        processStanza(stanza);
        
        var c = Frabjous.Store.find(Frabjous.Contact, "plays.shakespeare.lit");
        var identities = c.get('identities');
        
        expect(identities.get('length')).toEqual(2);
        expect(identities.objectAt(0)).toBeIdentity({category: "conference", type: "text", name: "Play-Specific Chatrooms"});
        expect(identities.objectAt(1)).toBeIdentity({category: "directory", type: "chatroom", name: "Play-Specific Chatrooms"});
      });
      
      it("should not send out a reply", function(){
        new Mock(Frabjous.Connection);
        Frabjous.Connection.expects('send').never();
        
        Frabjous.Connection.receive(stanza);
      });
    });
    
  });
  
});