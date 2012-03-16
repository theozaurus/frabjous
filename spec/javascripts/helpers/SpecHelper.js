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
    },
    toBeTrue: function(expected){
      return this.actual === true;
    },
    toBeFalse: function(expected){
      return this.actual === false;
    },
    toEqualModel: function(expected){
      this.message = function(){
        if(this.actual.constructor != expected.constructor ){
          return "Expected " + this.actual.constructor + " type to equal " + expected.constructor;
        }
        return "Expected " + this.actual.get('id').toString() + " to be " + expected.get('id').toString();
      };
      return this.actual.toString() == expected.toString();
    },
    toEqualModelArray: function(expected){
      var mapping = function(e){ return e.get('clientId'); };
      var expected_client_ids = $.map(expected, mapping);
      var actual_client_ids = this.actual.slice().map(mapping);
      this.message = function(){
        return "Expected " + actual_client_ids + " clientId's to be " + expected_client_ids;
      };
      return this.env.equals_(actual_client_ids, expected_client_ids);
    },
    toBeDirty: function(){
      return this.actual.isDirty;
    }
  });
});

var createStanza = function(string){
  return new Frabjous.Stanza(string);
};

var parseStanza = function(string){
  var stanza = createStanza(string);
  Frabjous.Parser.handle(stanza);
  return stanza;
};