beforeEach(function() {
  this.addMatchers({
    toBeJid: function(expected) {
      return this.actual.toString() == expected;
    }
  });
});

var createStanza = function(string){
  // Turn string into document element
  return $($.parseXML(string));
};

var parseStanza = function(string){
  var stanza = createStanza(string);
  Frabjous.Parser.handle(stanza);
};