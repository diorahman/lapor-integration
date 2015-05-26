var express = require('express');
var server = express();
var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.post('/lapor', function(req, res){
  console.log(req.body);
  var obj = {
    transaksiid: 12345,
    laporan: {
      type: req.body.lapor.type,
      trackingid: 12345,
      status: 'SUKSES',
      pesan: 'Pesan'
    }
  };
  res.send(obj);
});
server.listen(4000);
