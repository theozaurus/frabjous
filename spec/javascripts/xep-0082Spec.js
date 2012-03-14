describe("XEP-0082", function(){
  
  describe("Singleton method", function(){
    
    describe("toDate", function(){
      it("should convert Date string to Date object", function(){
        var r = Frabjous.Xep0082.toDate("1985-03-29");
        expect(r.toUTCString()).toEqual("Fri, 29 Mar 1985 00:00:00 GMT");
      });

      it("should convert DateTime string to Date object", function(){
        var r = Frabjous.Xep0082.toDate("1985-03-29T08:45:12Z");
        expect(r.toUTCString()).toEqual("Fri, 29 Mar 1985 08:45:12 GMT");
      });

      it("should convert DateTime string with milliseconds string to Date object", function(){
        var r = Frabjous.Xep0082.toDate("1985-03-29T08:45:12.034Z");
        expect(r.toUTCString()).toEqual("Fri, 29 Mar 1985 08:45:12 GMT");
        expect(r.getUTCMilliseconds()).toEqual(34);
      });

      it("should convert DateTime string with negative timezone to Date object", function(){
        var r = Frabjous.Xep0082.toDate("1985-03-29T08:45:12+01:30");
        expect(r.toUTCString()).toEqual("Fri, 29 Mar 1985 07:15:12 GMT");
      });

      it("should convert DateTime string with positive timezone to Date object", function(){
        var r = Frabjous.Xep0082.toDate("1985-03-29T08:45:12-01:00");
        expect(r.toUTCString()).toEqual("Fri, 29 Mar 1985 09:45:12 GMT");
      });
    });
    
    describe("toString", function(){
      it("should convert Date that is at midnight to Date string", function(){
        var d = new Date(Date.UTC(1985, 2, 29));
        var string = Frabjous.Xep0082.toString(d);
        expect(string).toEqual("1985-03-29");
      });
      
      it("should convert Date that is not on midnight to DateTime string", function(){
        var d = new Date(Date.UTC(1985, 2, 29, 3, 15, 59));
        var string = Frabjous.Xep0082.toString(d);
        expect(string).toEqual("1985-03-29T03:15:59Z");
      });
      
      it("should convert Date that has milliseconds to DateTime string with milliseconds", function(){
        var d = new Date(Date.UTC(1985, 2, 29, 0, 0, 0, 1));
        var string = Frabjous.Xep0082.toString(d);
        expect(string).toEqual("1985-03-29T00:00:00.001Z");
      });
      
      it("should convert Date that is for locale timezone to UTC", function(){
        // Test only useful when browser is not in UTC locale
        var d = new Date(1985, 2, 29, 10, 0,43);
        var string = Frabjous.Xep0082.toString(d);
        expect(string).toMatch(new RegExp("1985-03-29T0?"+d.getUTCHours()+":0?"+d.getUTCMinutes()+":43Z"));
      });
    });
    
  });
  
});