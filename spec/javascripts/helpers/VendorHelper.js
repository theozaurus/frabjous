//= require ../vendor/jsmocha

beforeEach(function() {
  this.addMatchers({
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
  this.addMatchers(EquivalentXml.jasmine);
});

afterEach(function(){
  $(Mock.mocked_objects).each(function(i, obj){
    expect(obj).verify_expectations();
  });
});