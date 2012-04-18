//= require ../vendor/jsmocha
//= require ../vendor/equivalent-xml

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

jsMocha.Expectation.prototype.passing_xml = function(string){
  jsMocha.Expectation.prototype.passing(function(params){
    xml_actual = EquivalentXml.xml(params[0]);
    xml_expected = EquivalentXml.xml(string);
    return EquivalentXml.isEquivalent(xml_actual, xml_expected);
  });
};

afterEach(function(){
  $(Mock.mocked_objects).each(function(i, obj){
    expect(obj).verify_expectations();
  });
});