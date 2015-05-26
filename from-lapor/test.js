var request = require('request');
var fs = require('fs');
function test(file) {
  fs.createReadStream(__dirname + '/' + file + '.xml').pipe(request.post({
    // url: 'http://104.155.218.47/notifikasi',
    url: 'http://localhost:3000/notifikasi',
    headers : {
      'Content-Type': 'application/xml',
      'Content-Length': 391
    }
  }, function(err, res, body){
    console.log(res.headers);
    console.log(err || body);
  }));
}
test(process.argv.pop());
