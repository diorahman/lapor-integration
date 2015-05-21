var parseString = require('xml2js').parseString;
var Writer = require('xml-writer');
var moment = require('moment');
var request = require('request');
var url = require('url');
var path = require('path');
var config = require('./config.js');

var rootUrl = config.rootUrl;

function ser(obj) {
  for (k in obj)
    obj[k] = Array.isArray(obj[k]) ? obj[k][0] : obj[k];
}

function uploadXMLRequest(body, res) {
  request.post({
    url : rootUrl + '/addstream',
    headers : {
      'User-Agent': config.userAgent || 'Kawal Menteri Org 1.0',
      'Content-Type': 'application/xml'
    },
    strictSSL: false,
    body : body
  }, function(err, resFromLapor, body){
    if (err && res && typeof res != 'function')
      return res.sendStatus(500);

    if (resFromLapor.statusCode != 200 && res && typeof res != 'function') 
      return res.send(resFromLapor.statusCode);

    // jokes!
    if (body.indexOf('A PHP Error was encountered') >= 0) {
      var idx = body.indexOf('<?xml version="1.0" encoding="UTF-8"?>');
      body = body.substring(idx);
    }

    parseString(body, function(err, json){
      if (err) {
        if (res) {
          if (typeof res == 'function')
            return res(err);
          return res.sendStatus(500);
        }
      }

      for (var k in json) {
        if (typeof json[k] == 'object')
          ser(json[k]);
      }

      if (!res)
        return console.log(JSON.stringify(json, null, 2));
      if (typeof res == 'function')
        return res(null, json);
      res.send(json);
    });
  });
}

function createXMLRequest(options){
  var xmlRequest = new Writer(options.ident);
  xmlRequest.startDocument();
  var root = xmlRequest.startElement('lapor');
  root.writeAttribute('token', options.token || '');

  var subject = root.startElement('pelapor');
  options.subject = options.subject || {};
  for (var key in options.subject) {
    subject.writeElement(key, options.subject[key]);
  }
  subject.endElement();

  // ugly hack!
  options.content = options.content || {};
  options.content.tanggal = options.content.tanggal || new Date();
  if (!options.content.tanggal instanceof Date) {
    var parsedDate = moment(options.content.tanggal);
    options.content.tanggal = parsedDate.valid() ? parsedDate.toDate() : new Date();
  }

  var content = root.startElement('laporan');
  for (var key in options.content) {
    var val = options.content[key];
    val = (val instanceof Date) ? moment(val).format('DD MMMM YYYY HH:mm:ss') : val;
    content.writeElement(key, val);
  }

  var attachments = options.attachments || [];
  if (attachments.length > 0) {
    var addedLinks = [];
    attachments.forEach(function(attachment){
      var file = {url : attachment.url || '', name : attachment.name || ''};
      if (typeof attachment == 'string')
        file.url = attachment;
      
      // todo validate url
      var parsed = url.parse(file.url);
      if (parsed.protocol.match(new RegExp('^https?')) && path.extname(parsed.path).match(new RegExp('.(jpg|png|gif)'))) {
        file.name = attachment.name || path.basename(parsed.path);
        addedLinks.push({name : file.name, url : file.url});
      }
    });

    if (addedLinks.length > 0) {
      var link = content.startElement('lampiran')
      addedLinks.forEach(function(addedLink){
        var theLink = link.startElement('tautan');
        theLink.writeAttribute('nama', addedLink.name);
        theLink.writeAttribute('url', addedLink.url);
        theLink.endElement();
      });
      link.endElement();
    }

    options.callback = options.callback || {};
    if (options.callback.url) {
      var callback = root.startElement('callback');
      callback.writeAttribute('method', options.callback.method || 'POST');
      callback.writeAttribute('url', options.callback.url);
      callback.endElement();
    }
  }
  content.endElement();
  xmlRequest.endDocument();
  return xmlRequest.toString();
}

function createAndUploadXMLRequest(body, res) {
  // todo validation!
  uploadXMLRequest(createXMLRequest(body), res);
}

module.exports = {
  create : createXMLRequest,
  upload : uploadXMLRequest,
  send : createAndUploadXMLRequest
}
