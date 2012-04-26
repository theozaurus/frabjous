describe("Callback", function(){

  var match    = function(){ return true;  };
  var no_match = function(){ return false; };

  describe("initialization", function(){
    
    it("should setup success function", function(){
      var func = function(){ };
      var subject = new Frabjous.Callback({success: func, is_match: match});
      
      expect(subject.success).toBe(func);
    });
    
    it("should setup completed function", function(){
      var func = function(){ };
      var subject = new Frabjous.Callback({completed: func, is_match: match});
      
      expect(subject.completed).toBe(func);
    });
    
    it("should setup error function", function(){
      var func = function(){ };
      var subject = new Frabjous.Callback({error: func, is_match: match});
      
      expect(subject.error).toBe(func);
    });
    
    it("should raise error if no is_match function is supplied", function(){
      expect(function(){ new Frabjous.Callback({}); }).toThrow("Callback created without an is_match function");
    });
    
  });
  
  describe("handle", function(){
    
    var result;
    
    describe("a success", function(){
      
      beforeEach(function(){
        result = true;
      });
      
      it("should call completed function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({completed: func, is_match: match});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });

      it("should call success function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({success: func, is_match: match});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });

      it("should not call error function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({error: func, is_match: match});

        subject.handle(result);

        expect(function_called).toBeFalse();
      });
    });
    
    describe("an error", function(){
      
      beforeEach(function(){
        result = false;
      });
      
      it("should call completed function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({completed: func, is_match: match});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });
      
      it("should not call success function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({success: func, is_match: match});

        subject.handle(result);

        expect(function_called).toBeFalse();
      });
      
      it("should call error function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({error: func, is_match: match});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });
    });
    
    describe("return value of handle", function(){
      describe("with must_keep = false", function(){
        it("should return true if there is no match", function(){
          var subject = new Frabjous.Callback({must_keep: false, is_match: no_match});
          expect(subject.handle()).toBeTrue();
        });
        
        it("should return false", function(){
          var subject = new Frabjous.Callback({is_match: match});
          expect(subject.handle()).toBeFalse();
        });
      });
      
      describe("with must_keep = true", function(){
        it("should return true if there is no match", function(){
          var subject = new Frabjous.Callback({must_keep: true, is_match: no_match});
          expect(subject.handle()).toBeTrue();          
        });
        
        it("should return true", function(){
          var subject = new Frabjous.Callback({must_keep: true, is_match: match});
          expect(subject.handle()).toBeTrue();
        });
      });
      
      describe("with must_keep undefined", function(){
        it("should return true if there is no match", function(){
          var subject = new Frabjous.Callback({is_match: no_match});
          expect(subject.handle()).toBeTrue();
        });
        
        it("should return false", function(){
          var subject = new Frabjous.Callback({is_match: match});
          expect(subject.handle()).toBeFalse();
        });
      });
      
      describe("with must_keep function", function(){
        it("should return true if there is no match", function(){
          var subject = new Frabjous.Callback({must_keep: function(){}, is_match: no_match});
          expect(subject.handle()).toBeTrue();
        });
        
        it("should pass extra parameters to must_keep function", function(){
          var result1, result2, result3;
          var func = function(one,two,three){
            result1 = one;
            result2 = two;
            result3 = three;
          };
          var subject = new Frabjous.Callback({must_keep: func, is_match: match});
          
          subject.handle(true, "first", "second", "third");

          expect(result1).toEqual("first");
          expect(result2).toEqual("second");
          expect(result3).toEqual("third");
        });
        
        it("should return, the return value of the function", function(){
          var func = function(){return 1;};
          var subject = new Frabjous.Callback({must_keep: func, is_match: match});
          expect(subject.handle()).toEqual(1);
        });
      });
    });
    
    describe("in general", function(){
      it("should pass extra parameters to the callback function", function(){
        var result1, result2, result3;
        var func = function(one,two,three){
          result1 = one;
          result2 = two;
          result3 = three;
        };
        var subject = new Frabjous.Callback({completed: func, is_match: match});
        
        subject.handle(true, "first", "second", "third");
        
        expect(result1).toEqual("first");
        expect(result2).toEqual("second");
        expect(result3).toEqual("third");
      });
      
      it("should pass extra parameters to the is_match function", function(){
        var result1, result2, result3;
        var func = function(one,two,three){
          result1 = one;
          result2 = two;
          result3 = three;
        };
        var subject = new Frabjous.Callback({is_match: func});
        
        subject.handle(true, "first", "second", "third");
        
        expect(result1).toEqual("first");
        expect(result2).toEqual("second");
        expect(result3).toEqual("third");
      });
    });
    
  });
  
});
