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
  //
/*
   {
      transaksiid: 12345
      laporan: {
        type: "DISPOSISI" // DISPOSISI, TUNTAS, PROSES, TINDAKLANJUT,
        trackingid: 12345,
        tanggal: "15 May 2014 11:03:11",
        status: "SUKSES",
        pesan: "PESAN"
      }
   }
 */
  console.log(parsed);
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parsed)
  }).pipe(function(err, response, body){
    if (err)
      return send(err);
    if (typeof body == 'string') {
      try {
        body = JSON.parse(body);
      }
      catch(ex) {
        return res.status(500).send(ex);
      }
    }
    res.append('Content-Type', 'application/xml');
    res.send(createResponse(body));  
  });
}
