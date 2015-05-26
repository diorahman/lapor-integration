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
  report.writeAttribute('type', obj.status || 'TUNTAS');
  obj.laporan = obj.laporan || {};
  for (var key in obj.laporan) {
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
  // then send it back to lapor!
  if (!config.replyUrl) {
    parsed.lapor = parsed.lapor || {};
    parsed.lapor.laporan = parsed.lapor.laporan || {};
    var tanggal = parsed.lapor.laporan.tindaklanjut ? 
      parsed.lapor.laporan.tindaklanjut.tanggal : parsed.lapor.laporan.tanggal;
    var obj = { 
      transaksiid: parsed.lapor.transaksiid || 12345,
      laporan: {
        type: parsed.lapor.type,
        trackingid: parsed.lapor.laporan.trackingid,
        status: 'SUKSES',
        pesan: 'Uji coba',
        tanggal: tanggal 
      }   
    };
    return res.send(obj);
  }

  request.post({
    url: config.replyUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parsed)
  }).pipe(res);
}
