describe("CallbackList",function(){
  
  var subject;
  
  var match = function(){};
  
  var bare_callback_factory = function(){
    return {completed: function(){}, is_match: match};
  };
  
  var callback_factory = function(){
    return new Frabjous.Callback(bare_callback_factory());
  };
  
  beforeEach(function(){
    subject = new Frabjous.CallbackList();
  });
  
  describe("add", function(){
    
    it("should allow adding of one bare callback", function(){
      var bare_callback = bare_callback_factory();
      
      var result = subject.add(bare_callback);
      
      expect(result).toIncludeCallback(bare_callback);
    });
    
    it("should allow adding of an array of bare callbacks", function(){
      var bare_callbacks = [bare_callback_factory(),bare_callback_factory()];
      
      var result = subject.add(bare_callbacks);
      
      expect(result).toIncludeCallback(bare_callbacks);
    });
    
    it("should allow adding of one callback", function(){
      var callback = callback_factory();
      
      var result = subject.add(callback);
      
      expect(result).toIncludeCallback(callback);
    });
    
    it("should allow adding of an array of callbacks", function(){
      var callback1 = callback_factory();
      var callback2 = callback_factory();
      var callbacks = [callback1,callback2];
      
      var result = subject.add(callbacks);
      
      expect(result).toIncludeCallback(callbacks);
    });
    
  });
  
  describe("clear", function(){
    it("should clear all callbacks", function(){
      var callback1 = bare_callback_factory();
      var callback2 = bare_callback_factory();
      subject.add(callback1);
      subject.add(callback2);
      
      expect(subject.size()).toEqual(2);
      
      subject.clear();
      
      expect(subject.size()).toEqual(0);
    });
  });
  
  describe("handle", function(){
    
    it("should not run any callbacks if none match", function(){
      var ran = false;
      subject.add({completed: function(){ ran = true; }, is_match: function(){return false;}});
      
      subject.handle();
      
      expect(ran).toBeFalse();
    });
    
    it("should run callbacks", function(){
      var ran1 = false;
      var ran2 = false;
      subject.add({completed: function(){ ran1 = true; }, is_match: function(){return true;}});
      subject.add({completed: function(){ ran2 = true; }, is_match: function(){return true;}});
      
      subject.handle();
      
      expect(ran1).toBeTrue();
      expect(ran2).toBeTrue();
    });
    
    it("should pass correct arguments to callback", function(){
      var callback = callback_factory();
      var first, second, third, fourth = false;
      
      // Override the callbacks handle function with our mock
      callback.handle = function(success,extra1,extra2,extra3){
        first  = success;
        second = extra1;
        third  = extra2;
        fourth = extra3;
      };
      
      subject.add(callback);
      
      subject.handle(true,"one","two","three");
      
      expect( first  ).toBeTrue();
      expect( second ).toEqual("one");
      expect( third  ).toEqual("two");
      expect( fourth ).toEqual("three");
    });
    
    it("should remove callback if must_keep returns false", function(){
      var alive = null;

      var callback = {completed: function(){alive = true;}, must_keep: false, is_match: function(){return true;}};
      
      // Register callback
      subject.add(callback);
      
      // Size increase, alive not affected
      expect(subject.size()).toEqual(1);
      expect(alive).toBeNull();
      
      // Callback run
      subject.handle();
      
      // Size decrease and alive set
      expect(subject.size()).toEqual(0);
      expect(alive).toBeTrue();
      
      // Reset alive
      alive = false;
      
      // Callback run
      subject.handle();
      
      // alive not touched
      expect(alive).toBeFalse();
    });
    
    it("should not remove callback if must_keep returns true", function(){
      var alive = null;

      var callback = {completed: function(){alive = true;}, must_keep: true, is_match: function(){return true;}};
      
      // Register callback
      subject.add(callback);
      
      // Size increase, alive not affected
      expect(subject.size()).toEqual(1);
      expect(alive).toBeNull();
      
      // Callback run
      subject.handle();
      
      // Size remains constant and alive set
      expect(subject.size()).toEqual(1);
      expect(alive).toBeTrue();
      
      // Reset alive
      alive = false;
      
      // Callback run
      subject.handle();
      
      // alive not touched
      expect(alive).toBeTrue();
    });
    
  });
  
});