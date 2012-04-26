describe("Frabjous.Temporary",function(){
  
  var subject = Frabjous.Temporary;
  
  beforeEach(function(){
    Frabjous.Store.init();
  });
    
  it("is_permanent should return false", function(){
    var instance = new subject({});
    expect( instance.get('is_permanent') ).toBeFalse();
  });
  
  it("is_temporary should return true", function(){
    var instance = new subject({});
    expect( instance.get('is_temporary') ).toBeTrue();
  });
  
});