describe("Presence", function() {

  beforeEach(function() {
  });

  describe("when received", function(){
    it("should create a presence object", function(){
      var s = parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      
      var m = Frabjous.Store.find(Frabjous.Presence,s.id());
      expect(m.get('status')).toEqual('I shall return!');
      expect(m.get('show')).toEqual('away');
      expect(m.get('from')).toBeJid('romeo@example.net/orchard');
      expect(m.get('to')).toBeJid('mercutio@example.org');
      expect(m.get('priority')).toEqual(1);
    });
  });

});
