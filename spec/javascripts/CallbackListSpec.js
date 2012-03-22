describe("CallbackList",function(){
  
  var subject;
  
  describe("add", function(){
    
    beforeEach(function(){
      subject = new Frabjous.CallbackList();
    });
    
    it("should allow adding of one bare callback", function(){
      var id = "12";
      var bare_callback = {completed: function(){}};
      
      subject.add(id,bare_callback);
            
      expect(subject.find(id)).toIncludeCallback(bare_callback);
    });
    
    it("should allow adding of an array of bare callbacks", function(){
      var id = "12";
      var bare_callbacks = [{completed: function(){}},{error: function(){}}];
      
      subject.add(id,bare_callbacks);
      
      expect(subject.find(id)).toIncludeCallbacks(bare_callbacks);
    });
    
    it("should allow adding of one callback", function(){
      var id = "345";
      var callback = new Frabjous.Callback({completed: function(){}});
      
      subject.add(id,callback);
      
      expect(subject.find(id)).toIncludeCallback(callback);
    });
    
    it("should allow adding of an array of callbacks", function(){
      var id = "345";
      var callback1 = new Frabjous.Callback({completed: function(){}});
      var callback2 = new Frabjous.Callback({completed: function(){}});
      var callbacks = [callback1,callback2];
      
      subject.add(id,callbacks);
      
      expect(subject.find(id)).toIncludeCallbacks(callbacks);
    });
    
  });
  
  describe("find", function(){
    it("should return an empty array if no callbacks exist", function(){
      expect(subject.find("12")).toEqual([]);
    });
    
    it("should return an array of the correct callbacks if there are some", function(){
      var callback1 = {completed: function(){}};
      var callback2 = {completed: function(){}};
      
      subject.add("12", callback1);
      subject.add("13", callback2);
      
      expect(subject.find("13")).toIncludeCallback(callback2);
    });
  });
  
  describe("clear", function(){
    it("should clear a certain id's callbacks", function(){
      var callback1 = {completed: function(){}};
      var callback2 = {completed: function(){}};
      subject.add("12", callback1);
      subject.add("13", callback2);
      
      subject.clear("12");
      
      expect(subject.find("12")).toEqual([]);
      expect(subject.find("13")).toIncludeCallback(callback2);
    });
  });
  
  describe("clear_all", function(){
    it("should clear all callbacks", function(){
      var callback1 = {completed: function(){}};
      var callback2 = {completed: function(){}};
      subject.add("12", callback1);
      subject.add("13", callback2);
      
      subject.clear_all();
      
      expect(subject.find("12")).toEqual([]);
      expect(subject.find("13")).toEqual([]);
    });
  });
  
  describe("handle", function(){
    
    it("should not run any callbacks if none exist for that id", function(){
      var ran = false;
      subject.add("12", {completed: function(){ ran = true; }});
      
      subject.handle("15",true);
      
      expect(ran).toBeFalse();
    });
    
    it("should run callbacks", function(){
      var ran1 = false;
      var ran2 = false;
      subject.add("12", {completed: function(){ ran1 = true; }});
      subject.add("12", {completed: function(){ ran2 = true; }});
      
      subject.handle("12",true);
      
      expect(ran1).toBeTrue();
      expect(ran2).toBeTrue();
    });
    
    it("should pass correct arguments to callback", function(){
      var callback = new Frabjous.Callback({});
      var first, second, third, fourth = false;
      
      // Override the callbacks handle function with our mock
      callback.handle = function(success,extra1,extra2,extra3){
        first  = success;
        second = extra1;
        third  = extra2;
        fourth = extra3;
      };
      
      subject.add("12",callback);
      
      subject.handle("12",true,"one","two","three");
      
      expect( first  ).toBeTrue();
      expect( second ).toEqual("one");
      expect( third  ).toEqual("two");
      expect( fourth ).toEqual("three");
    });
    
    it("should remove all callbacks after they have been run", function(){
      subject.add("12", {completed: function(){ ran = true; }});
      subject.add("12", {completed: function(){ ran = true; }});
      
      subject.handle("12",true);
      
      expect(subject.find("12")).toEqual([]);
    });
    
  });
  
});