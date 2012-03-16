describe("XEP-0203", function() {

  var type;
  var date;
  var reason;
  var from;
  var id;

  var object_with_delay = function(){
    var m = Frabjous.Store.find(type,id);
    var d = m.get('delay');

    expect(m.get('received_at')).toBeDate(date);
    expect(d.get('reason')).toEqual(reason);
    expect(d.get('stamp')).toBeDate(date);
    expect(d.get('from')).toBeJid(from);
  };

  var object_without_delay = function(){
    var m = Frabjous.Store.find(type,id);
    var d = m.get('delay');

    var now = new Date();
    var created_at = m.get('created_at');
    expect(created_at).toBeCloseTo(now);
    expect(m.get('received_at')).toBeDate(created_at);
    expect(m.get('delay')).toBeNull();
  };
  
  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when message", function(){
    beforeEach(function(){
      type = Frabjous.Message;
    });

    describe("received with delay", function(){

      beforeEach(function(){
        date   = '2002-09-10T23:08:25+01:00';
        from   = 'capulet.com';
        reason = 'Offline Storage';

        var stanza = "<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body><delay xmlns='urn:xmpp:delay' from='capulet.com' stamp='2002-09-10T23:08:25+01:00'>Offline Storage</delay></message>";
        var s = parseStanza(stanza);
        id = s.id();
      });

      it("should create a message object with delay", object_with_delay);
    });

    describe("received without delay", function(){
      beforeEach(function(){
        id = '14a';
        var stanza = "<message type='chat' to='bob@bar.com' from='alice@bar.com'><body>hello there</body></message>";
        var s = parseStanza(stanza);
        id = s.id();
      });

      it("should create a presence object with no delay", object_without_delay);
    });
  });

  describe("when presence", function(){
    beforeEach(function(){
      type = Frabjous.Presence;
    });

    describe("received with delay", function(){

      beforeEach(function(){
        date = '2002-09-10T23:41:07Z';
        from = 'juliet@capulet.com/balcony';
        reason = '';

        var stanza = "<presence from='juliet@capulet.com/balcony' to='romeo@montague.net'><status>anon!</status><show>xa</show><priority>1</priority><delay xmlns='urn:xmpp:delay' from='juliet@capulet.com/balcony' stamp='2002-09-10T23:41:07Z'/></presence>";
        var s = parseStanza(stanza);
        id = s.id();
      });

      it("should create a message object with delay", object_with_delay);
    });

    describe("received without delay", function(){
      beforeEach(function(){
        var stanza = "<presence from='juliet@capulet.com/balcony' to='romeo@montague.net'><status>anon!</status><show>xa</show><priority>1</priority></presence>";
        var s = parseStanza(stanza);
        id = s.id();
      });

      it("should create a presence object with no delay", object_without_delay);
    });
    
    it("when messages are received out of order, the presence_history for a contact should be in the correct order", function(){
      var s1 = parseStanza("<presence from='juliet@capulet.com/balcony' to='romeo@montague.net'><status>Sleeping</status><show>dnd</show><priority>1</priority></presence>");
      var p1 = Frabjous.Store.find(Frabjous.Presence, s1.id());
      
      var s2 = parseStanza("<presence from='juliet@capulet.com/balcony' to='romeo@montague.net'><status>anon!</status><show>xa</show><priority>1</priority><delay xmlns='urn:xmpp:delay' from='juliet@capulet.com/balcony' stamp='2002-09-10T23:41:07Z'/></presence>");
      var p2 = Frabjous.Store.find(Frabjous.Presence, s2.id());
      
      var c = Frabjous.Store.find(Frabjous.Contact,'juliet@capulet.com/balcony');
      
      expect(c.get('presence_history')).toEqualModelArray([p2,p1]); // opposite order they were recieved in
      expect(c.get('presence')).toEqualModel(p1);
    });
  });

});