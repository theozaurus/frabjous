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
    },
    toIncludeCallback: function(expected){ 
      var make_bare = function(e){
        return {
          completed: e.completed,
          success:   e.success,
          error:     e.error
        };
      };
      
      var bare_actuals = $.map(this.actual,function(e){
        return make_bare(e);
      });
      var bare_expected = make_bare(expected);
      
      var that = this;
      var any = false;      
      $.each(bare_actuals,function(i,e){
        any = that.env.equals_(e,bare_expected);
        return !any; // Will break when any is true
      });
      
      return any;
    },
    toIncludeCallbacks: function(expected){
      var make_bare = function(e){
        return {
          completed: e.completed,
          success:   e.success,
          error:     e.error
        };
      };
      
      var bare_actuals  = $.map(this.actual,function(e){ return make_bare(e); });
      var bare_expected = $.map(expected,function(e){ return make_bare(e); });
      
      var that = this;
      var test = function(expected){
        var any = false;      
        $.each(bare_actuals,function(i,e){
          any = that.env.equals_(e,expected);
          return !any; // Will break when any is true
        });
        return any;
      };
      
      return bare_expected.every(function(e){ return test(e); });
    },
    verify_expectations: function() {
      if(this.actual.jsmocha.verify()){
        this.actual.jsmocha.teardown();
        return true;
      }else{
        this.message = function() {
          return this.actual.jsmocha.report();
        };
        return false;
      }
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

afterEach(function(){
  $(Mock.mocked_objects).each(function(i, obj){
    expect(obj).verify_expectations();
  });
});