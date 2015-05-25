var request = require('request');
var fs = require('fs');
function test(file) {
  console.log(file)
  fs.createReadStream(__dirname + '/' + file + '.xml').pipe(request.post({
    url: 'http://localhost:3000/balas',
    headers : {
      'Content-Type': 'application/xml'
    }
  }));
}
test(process.argv.pop());
