describe("Presence", function() {

  var klass = Frabjous.Presence;

  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when received", function(){
    it("should create a presence object", function(){
      var s = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      
      var m = Frabjous.Store.find(klass,s.id());
      expect(m.get('status')).toEqual('I shall return!');
      expect(m.get('show')).toEqual('away');
      expect(m.get('from')).toBeJid('romeo@example.net/orchard');
      expect(m.get('to')).toBeJid('mercutio@example.org');
      expect(m.get('priority')).toEqual(1);
    });
    
    it("should link to a contact", function(){
      var s = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      
      var p = Frabjous.Store.find(klass, s.id());
      var c = Frabjous.Store.find(Frabjous.Contact,'romeo@example.net/orchard');
      
      expect(p).not.toBeDirty();
      expect(p.get('contact')).toEqualModel(c);
      expect(c).not.toBeDirty();
      expect(c.get('presence_history')).toEqualModelArray([p]);
    });
    
    it("should build has many to contact", function(){
      var s1 = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      var p1 = Frabjous.Store.find(klass, s1.id());
      
      var s2 = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      var p2 = Frabjous.Store.find(klass, s2.id());
      
      var c = Frabjous.Store.find(Frabjous.Contact,'romeo@example.net/orchard');
      
      expect(p1.get('contact')).toEqualModel(c);
      expect(p2.get('contact')).toEqualModel(c);
      expect(c.get('presence_history')).toEqualModelArray([p1,p2]);
    });
    
    it("should update the contacts presence attribute to be the last one", function(){
      var s1 = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      var p1 = Frabjous.Store.find(klass, s1.id());
      
      var c = Frabjous.Store.find(Frabjous.Contact,'romeo@example.net/orchard');
      
      expect(c.get('presence')).toEqualModel(p1);
      
      var s2 = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      var p2 = Frabjous.Store.find(klass, s2.id());
      
      expect(c.get('presence')).toEqualModel(p2);
    });
  });

});
