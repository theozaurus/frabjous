describe("Presence", function() {

  beforeEach(function() {
  });

  describe("when received", function(){
    it("should create a presence object", function(){
      parseStanza("<presence from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status><priority>1</priority></presence>");
      
      var m = Frabjous.Store.findAll(Frabjous.Presence).get('lastObject');
      expect(m.get('status')).toEqual('I shall return!');
      expect(m.get('show')).toEqual('away');
      expect(m.get('from')).toBeJid('romeo@example.net/orchard');
      expect(m.get('to')).toBeJid('mercutio@example.org');
      expect(m.get('priority')).toEqual(1);
    });
    
    it("should create a message object with id of message if present", function(){
      parseStanza("<presence id='12' from='romeo@example.net/orchard' to='mercutio@example.org'><show>away</show><status>I shall return!</status></presence>");
      
      var id = '12';
      var m = Frabjous.Store.find(Frabjous.Presence,id);
      expect(m.get('status')).toEqual('I shall return!');
      expect(m.get('show')).toEqual('away');
      expect(m.get('from')).toBeJid('romeo@example.net/orchard');
      expect(m.get('to')).toBeJid('mercutio@example.org');
      expect(m.get('priority')).toEqual(0);
    });
  });

});
