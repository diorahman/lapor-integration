var xmlParser = require('express-xml-bodyparser');
var publicReport = require('./public-report');
var bodyParser = require('body-parser');
var express = require('express');
var report = require('./report');
var reply = require('./reply');
var auth = require('./auth');
var cors = require('cors');
var server = express();
server.disable('x-powered-by');
server.use(cors());
server.use(bodyParser.json());
server.use(xmlParser({ explicitArray: false, mergeAttrs: true, trim: true, charkey: 'data'}));
server.use(function(err, req, res, next){
  if (!err)
    return next();
  console.log(err);
  res.status(400).send(err);
});
server.get('/', function(req, res){
  res.send('hihi');
});
server.post('/lapor', auth, function(req, res){
  if (!req.body) 
    return res.sendStatus(400);
  report.send(req.body, res);
});
server.post('/balas', function(req, res, next){
  if (!req.body)
    return res.sendStatus(400);
  reply(req.body, res);
});
server.listen(process.env.PORT || 3000);
console.log('~>', process.env.PORT || 3000);
