//= require ember
//= require ember-data

Frabjous.Xep0082 = {
  toDate: function(string){
    var format = /^\d{4}\-\d{2}\-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|([+\-]\d{2}:\d{2})))?$/;
    
    if(typeof string != "string" || !format.test(string) ){ return null; }
    
    // If date just looks like 2012-02-08 add T00:00:00Z (for Safari)
    if(/^\d{4}\-\d{2}\-\d{2}$/.test(string)){
      string = string + "T00:00:00Z";
    }
    
    // Parse date
    var date = new Date(Date.parse(string));
    
    return date;
  },
  toString: function(date){
    var pad = function(number,size){
      var padding = new Array(size).join(0); // Creates string of 0 one less than requested
      return (padding + number.toString()).slice(-1 * size);
    };
    
    var datetime = function(d){
      // If any hours, minutes, seconds and milliseconds do not equal 0 we are dealing with a datetime
      return d.getUTCHours() !== 0 || d.getUTCMinutes() !== 0 || d.getUTCSeconds() !== 0 || datetimems(d);
    };
    
    var datetimems = function(d){
      return d.getUTCMilliseconds() !== 0;
    };
    
    //yyyy-mm-dd[Thh:mm:ss[.sss]tz]
    var yy = date.getUTCFullYear().toString();
    var mo = pad(date.getUTCMonth() + 1,2);
    var dd = pad(date.getUTCDate(),2);
    var hh = pad(date.getUTCHours(),2);
    var mm = pad(date.getUTCMinutes(),2);
    var ss = pad(date.getUTCSeconds(),2);
    var ms = pad(date.getUTCMilliseconds(),3);
    var tz = "Z";
    
    var string = yy+"-"+mo+"-"+dd;
    if(datetime(date)){
      // DateTime
      string = string + "T"+hh+":"+mm+":"+ss;
      if(datetimems(date)){
        string = string + "." + ms;
      }
      string = string + tz; 
    }
    
    return string;
  }
};

DS.attr.transforms.Xep0082dateString = {
  from: function(serialized) {
    return Frabjous.Xep0082.toDate(serialized);
  },
  to: function(deserialized) {
    return Em.none(deserialized) ? null : Frabjous.Xep0082.toString(deserialized);
  }
};