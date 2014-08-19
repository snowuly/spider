var http = require('http'),
    p    = require('./params.js'),
    record = require('./analysis.js'),
    date = require('./date.js');

var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
    host = 'et.airchina.com.cn';

function con (from, to, date, callback) {
  var qs = p.get(from, to, date);
  var cookie = 'JSESSIONID=66B9A02A5D818979B37FBA36ADB95BDE; current_PoS=AIRCHINA_CN; BIGipServerWeb_http=1292508844.20480.0000; mbox=check#true#1408359896|session#1408359835725-614837#1408361696; currentLang=zh_CN; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3D%3B';

  var o = {
    hostname: host,
    path: '/InternetBooking/AirOneWayCombinableSingleDateSearchAction.do',
    headers: {
      'User-Agent': ua,
      'Cookie': cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'http://et.airchina.com.cn/InternetBooking/AirFareFamiliesFlexibleForward.do',
      'Content-Length': qs.length
    }
  };

  var req = http.request(o, function (res) {
    if (res.statusCode !== 200) { console.log('Error: ' + res.statusCode + ', ' + o['path']); return; }

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

con('PEK', 'SHA', '2014/09/20', function (data) {
  console.log(data);
});



