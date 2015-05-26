var request = require('request');
var fs = require('fs');
function test(file) {
  fs.createReadStream(__dirname + '/' + file + '.xml').pipe(request.post({
    url: 'http://localhost:3000/notifikasi',
    headers : {
      'Content-Type': 'text/xml'
    }
  }, function(err, res, body){
    console.log(err || body);
  }));
}
test(process.argv.pop());
