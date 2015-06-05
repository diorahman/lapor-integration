var Writer = require('xml-writer');
var config = require('./config');
var request = require('request');

function createResponse(obj) {
  var xmlRequest = new Writer();
  xmlRequest.startDocument();
  var root = xmlRequest.startElement('lapor');
  root.writeAttribute('type', 'RESPON');
  root.writeElement('transaksiid', obj.transaksiid);
  var report = root.startElement('laporan');
  obj.laporan = obj.laporan || {};
  for (var key in obj.laporan) {
    if (key == 'type') 
      report.writeAttribute(key, obj.laporan[key]);
    else if (obj.laporan[key])
      report.writeElement(key, obj.laporan[key]);
  }
  report.endElement();
  root.endElement();
  return root.toString();
}

module.exports = function(parsed, res) {
  // todo: send report to main system, expect an object with following format:
  // then send it back to lapor!
  if (!config.replyUrl) {
    parsed.lapor = parsed.lapor || {};
    parsed.lapor.laporan = parsed.lapor.laporan || {};
    var tanggal = parsed.lapor.laporan.tindaklanjut ? 
      parsed.lapor.laporan.tindaklanjut.tanggal : parsed.lapor.laporan.tanggal;
    if (parsed.lapor.laporan.status)
      tanggal = parsed.lapor.laporan.status.tanggal;
    var obj = { 
      transaksiid: parsed.lapor.transaksiid || 17081945,
      laporan: {
        type: parsed.lapor.type,
        trackingid: parsed.lapor.laporan.trackingid || 17081945,
        status: 'SUKSES',
        pesan: 'Uji coba',
        tanggal: tanggal 
      }   
    };
    res.append('Content-Type', 'application/xml');
    return res.send(createResponse(obj));  
  }
  request.post({
    url: config.replyUrl,
    followRedirect: true,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parsed)
  }, function(err, response, body) {
    res.append('Content-Type', 'application/xml');
    if (err || response.statusCode != 200) {
      var err = {};
      var message = err.message || 'Something is wrong with the upstream system';
      var code = response.statusCode || 400;
      return res.status(code).send('<error><message>' + message + '</message></error>'); 
    }
    if (typeof body == 'string') {
      try {
        body = JSON.parse(body);
      } catch(ex) {
        return res.status(500).send('<error><message>' + ex.message + '</message></error>');
      }
    }
    res.send(createResponse(body));
  });
}
