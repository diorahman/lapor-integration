var publicReport = require('./public-report');
var bodyParser = require('body-parser');
var express = require('express');
var report = require('./report');
var auth = require('./auth');
var cors = require('cors');
var server = express();
server.disable('x-powered-by');
server.use(cors());
server.use(bodyParser.json());
server.get('/', function(req, res){
  res.send('hihi');
});
server.post('/lapor', auth, function(req, res){
  if (!req.body) 
    return res.sendStatus(400);
  report.send(req.body, res);
});
server.post('/balas', function(req, res){
  res.sendStatus(200);
});
server.listen(process.env.PORT || 3000);
console.log('~>', process.env.PORT || 3000);
