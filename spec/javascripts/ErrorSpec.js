describe("Error", function() {

  var klass = Frabjous.Error;

  beforeEach(function() {
    Frabjous.Store.init();
  });

  describe("when received", function(){
    
    var tests = function(){

      it("should create an object with an error", function(){
        var o = processStanza("<presence from='characters@muc.example.com/JulieC' id='y2bs71v4' to='juliet@im.example.com/balcony' type='error'><error type='auth'><forbidden xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></presence>");

        var e = o.get('error');
        if(o.get('is_permanent')){
          expect(e.get('type')).toEqual('auth');
          expect(e.get('condition')).toEqual('forbidden');
          expect(e.get('condition_payload')).toBeNull();
          expect(e.get('text')).toBeNull();
          expect(e.get('by')).toBeNull(); 
        }else{
          expect(e.type).toEqual('auth');
          expect(e.condition).toEqual('forbidden');
          expect(e.condition_payload).toBeNull();
          expect(e.text).toBeNull();
          expect(e.by).toBeNull();
        }
      });

      it("should pick out the text if it exists", function(){
        var o = processStanza("<presence from='characters@muc.example.com/JulieC' id='y2bs71v4' to='juliet@im.example.com/balcony' type='error'><error type='auth'><forbidden xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/><text xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>You are not allowed to do this</text></error></presence>");

        var e = o.get('error');
        if(o.get('is_permanent')){
          expect(e.get('type')).toEqual('auth');
          expect(e.get('condition')).toEqual('forbidden');
          expect(e.get('condition_payload')).toBeNull();
          expect(e.get('text')).toEqual('You are not allowed to do this');
          expect(e.get('by')).toBeNull();
        }else{
          expect(e.type).toEqual('auth');
          expect(e.condition).toEqual('forbidden');
          expect(e.condition_payload).toBeNull();
          expect(e.text).toEqual('You are not allowed to do this');
          expect(e.by).toBeNull();
        }
      });

      it("should pick out by if it exists", function(){
        var o = processStanza("<message from='romeo@example.net' id='sj2b371v' to='juliet@im.example.com/churchyard' type='error'><error by='example.net' type='cancel'><gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>xmpp:romeo@afterlife.example.net</gone></error></message>");

        var e = o.get('error');
        if(o.get('is_permanent')){
          expect(e.get('type')).toEqual('cancel');
          expect(e.get('condition')).toEqual('gone');
          expect(e.get('condition_payload')).toEqual('xmpp:romeo@afterlife.example.net');
          expect(e.get('text')).toBeNull();
          expect(e.get('by')).toEqual('example.net');
        }else{
          expect(e.type).toEqual('cancel');
          expect(e.condition).toEqual('gone');
          expect(e.condition_payload).toEqual('xmpp:romeo@afterlife.example.net');
          expect(e.text).toBeNull();
          expect(e.by).toEqual('example.net');
        }

      });

      it("should set has_error property on object", function(){
        var o = processStanza("<message from='romeo@example.net' id='sj2b371v' to='juliet@im.example.com/churchyard' type='error'><error by='example.net' type='cancel'><gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>xmpp:romeo@afterlife.example.net</gone></error></message>");

        expect(o.get('has_error')).toBeTrue();
      });

      it("should not set has_error property on object if there is no error", function(){
        var o = processStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>My ears have not yet drunk a hundred words</body></message>");

        expect(o.get('has_error')).toBeFalse();
      });

      it("should set is_success property on object", function(){
        var o = processStanza("<message from='romeo@example.net' id='sj2b371v' to='juliet@im.example.com/churchyard' type='error'><error by='example.net' type='cancel'><gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>xmpp:romeo@afterlife.example.net</gone></error></message>");

        expect(o.get('is_success')).toBeFalse();
      });

      it("should not set has_error property on object if there is no error", function(){
        var o = processStanza("<message from='juliet@example.com/balcony' to='romeo@example.net' type='chat'><body>My ears have not yet drunk a hundred words</body></message>");

        expect(o.get('is_success')).toBeTrue();
      });
    };
    
    describe("for permanent object", function(){

      it("should create a temporary object", function(){
        // sanity test
        var o = processStanza("<presence from='characters@muc.example.com/JulieC' id='y2bs71v4' to='juliet@im.example.com/balcony' type='error'><error type='auth'><forbidden xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></presence>");
        
        expect( o.get('is_temporary') ).toBeFalse();
      });
      
      tests();
      
    });
    
    describe("for temporary object", function(){

      beforeEach(function(){
        Frabjous.Parser.handlers().Temp = {
          name: "Temp",
          parse: function(s){ return {id: s.id(), store: false }; }
        };
      });

      it("should create a temporary object", function(){
        // sanity test
        var o = processStanza("<presence from='characters@muc.example.com/JulieC' id='y2bs71v4' to='juliet@im.example.com/balcony' type='error'><error type='auth'><forbidden xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/></error></presence>");
        
        console.warn(o.get('error'));
        
        expect( o.get('is_temporary') ).toBeTrue();
      });
      
      tests();

      afterEach(function(){
        delete Frabjous.Parser.handlers().Temp;
      });

    });

  });

});
