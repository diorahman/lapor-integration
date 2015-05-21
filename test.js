var report = require('./report');
var data = require('./data');
var parse = require('xml2js').parseString;

describe('Report to lapor', function(){
  it('should create a valid xml', function(done){
    var xml = report.create(data);
    parse(xml, function(err, json){
      if (err) return done(err);
      done();
    }); 
  });
  it('should send a valid xml', function(done){
    var xml = report.create({});
    report.upload(xml, function(err, result){
      if (err) return done(err);
      result.should.have.property('lapor');
      done();
    });
  });
});
