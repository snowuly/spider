var http = require('http'),
    p = require('./params.js'),
    c = require('./getcookie.js'),
    record = require('./analysis.js'),
    date = require('./date.js');

var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36';
    
var from, to, today = date.getDate();

var o = {
  hostname: 'et.airchina.com.cn',
  path: '/InternetBooking/AirOneWayCombinableSingleDateSearchAction.do',
  method: 'POST',
  headers: {
    'User-Agent': ua,
    'Cookie': '',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://et.airchina.com.cn/InternetBooking/AirFareFamiliesFlexibleForward.do',
    'Content-Length': '',
  }
};

function get (date, callback) {
  var qs = p.get(from, to, date);

  o['headers']['Content-Length'] = qs.length;

  var req = http.request(o, function (res) {
    if (res.statusCode !== 200) { console.log('Error: ' + res.statusCode + ', ' + o['path']); callback(null); return; }

    res.setEncoding('utf-8');
    var data = '';
    res.on('data', function (d) { data += d; });
    res.on('end', function () {

      data = data.match(/dataDump: {([^}]*)}/);
      if (data) {
        data = data[1].replace(/\\n|\\t|\\"|\s/g, '').
          replace(/\\u([0-9a-f]{4})/g, function (a, b) { 
            return String.fromCharCode(parseInt(b, 16));
        });

        var r = /"[\d\-]+": ?"([^"]+)"/g,
            datum, results = [];

        while (datum = r.exec(data)) {
          results.push(record.get(datum[1], date));
        }
        
        callback(results);
        
      }

    });
  });
  req.end(qs);
}

function init(f, t, c) {
  from = f; to = t; o['headers']['Cookie'] = c;
}

exports.init = init;
exports.get = get;





