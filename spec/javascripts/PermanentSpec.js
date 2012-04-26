describe("Frabjous.Permanent",function(){
  
  var subject = Frabjous.Permanent;
  
  beforeEach(function(){
    Frabjous.Store.init();
  });
    
  it("is_permanent should return true", function(){
    var instance = factory(subject,{id: 1});
    expect( instance.get('is_permanent') ).toBeTrue();
  });
  
  it("is_temporary should return false", function(){
    var instance = factory(subject,{id: 1});
    expect( instance.get('is_temporary') ).toBeFalse();
  });
  
});