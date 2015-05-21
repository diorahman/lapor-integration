var request = require('request');
var key = require('./key');

var URL = 'https://lapor.go.id/home/streams';
var SUFFIX = '/0/old/beranda'
// todo get cookie mechanism
var COOKIE = key.cookie;

function streamReports(options, res) {
  options = options || {};
  options.key = options.key || '0';
  options.cookie = options.cookie || COOKIE;

  var url = URL + '/' + options.key + SUFFIX;
  var options = {
    url: url,
    method: 'POST',
    json: true,
    headers : {
      'Cookie': options.cookie,
      'Referer': 'https://lapor.ukp.go.id/',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  request(options, function(err, reply, body){
    if (err) return res.sendStatus(400);
    if (reply.statusCode != 200) return res.sendStatus(400);
    res.send(body);
  });
}

module.exports = {
  stream : streamReports
}
