beforeEach(function() {
  this.addMatchers({
    toBeJid: function(expected) {
      return this.actual.toString() == expected;
    },
    toBeDate: function(date_or_string){
      // Marshall input
      var date = date_or_string;
      if(typeof date == "string"){
        date = Frabjous.Xep0082.toDate(date_or_string);
      }
      return this.actual.valueOf() == date.valueOf();
    },
    toBeCloseTo: function(expectedDate){
      var difference = Math.abs(this.actual.valueOf() - expectedDate.valueOf());
      // Dates must be within 5000ms
      return difference < 5000;
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