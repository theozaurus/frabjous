describe("Callback", function(){

  describe("initialization", function(){
    
    it("should setup success function", function(){
      var func = function(){ };
      var subject = new Frabjous.Callback({success: func});
      
      expect(subject.success).toBe(func);
    });
    
    it("should setup completed function", function(){
      var func = function(){ };
      var subject = new Frabjous.Callback({completed: func});
      
      expect(subject.completed).toBe(func);
    });
    
    it("should setup error function", function(){
      var func = function(){ };
      var subject = new Frabjous.Callback({error: func});
      
      expect(subject.error).toBe(func);
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
        var subject = new Frabjous.Callback({completed: func});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });

      it("should call success function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({success: func});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });

      it("should not call error function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({error: func});

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
        var subject = new Frabjous.Callback({completed: func});

        subject.handle(result);

        expect(function_called).toBeTrue();
      });
      
      it("should not call success function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({success: func});

        subject.handle(result);

        expect(function_called).toBeFalse();
      });
      
      it("should call error function", function(){
        var function_called = false;
        var func = function(){ function_called = true; };
        var subject = new Frabjous.Callback({error: func});

        subject.handle(result);

        expect(function_called).toBeTrue();
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
        var subject = new Frabjous.Callback({completed: func});
        
        subject.handle(true, "first", "second", "third");
        
        expect(result1).toEqual("first");
        expect(result2).toEqual("second");
        expect(result3).toEqual("third");
      });
    });
    
  });
  
});
