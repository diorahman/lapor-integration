var Writer = require('xml-writer');

function createResponse(obj) {
  var xmlRequest = new Writer();
  xmlRequest.startDocument();
  var root = xmlRequest.startElement('lapor');
  root.writeAttribute('type', 'RESPON');
  root.writeElement('transaksiid', obj.transaksiid);
  var report = root.startElement('laporan');
  report.writeAttribute('type', obj.status || 'TUNTAS');
  obj.report = obj.report || {};
  for (var key in obj.report) {
    report.writeElement(key, obj.report[key]);
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
      report: {
        type: "DISPOSISI" // DISPOSISI, TUNTAS, PROSES, TINDAKLANJUT,
        trackingid: 12345,
        tanggal: "15 May 2014 11:03:11",
        status: "SUKSES",
        pesan: "PESAN"
      }
   }
 */
  // then send it back to lapor!
  console.log(JSON.stringify(parsed, null, 2));
  res.send(parsed);
}


