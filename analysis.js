var date = require('./date.js');

var today = date.getDate();

function get (str, day) {
  var r = {
    flight: '',
    depart: '', // depart time
    arrive: '',
    type: '', // 
    first: '',
    first_n: '', // -1 充足 0 无票 
    business: '',
    business_n: '',
    economy: '',
    economy_n: '',
    discount: '',
    discount_n: '',
    special: '',
    special_n: '',
    query_time: date.getTime(),
    query_date: today,
    date: day
  };

  var index = str.search('<tdid=itineraryPriceCell_');

  if (index < 0) { throw new Error('get: invalid format'); return; }

  var first = str.slice(0, index),
      second = str.slice(index);

  first = first.split('</td><td');
  second = second.split('<tdid=itineraryPriceCell_');
  second.shift();

  var o = [
    ['flight', />(CA\d+)</],
    ['depart', />(\d{2}:\d{2})</],
    ['arrive', />(\d{2}:\d{2})</],
    ['route', />([A-Z]+-[A-Z]+)</],
    ['type', />([\da-z]+)</i]
  ];

  var oi, i, m;

  for (i = 0; i < first.length; i++) {
    oi = o[i];
    m = first[i].match(oi[1]);
    if (m) {
      r[oi[0]] = m[1];
    } else {
      console.log('error: ' + i + ': ' + first[i]);
    }
  }

  var so = ['first', 'business', 'economy', 'discount', 'specil'];

  for (i = 0; i < second.length; i++) {
    var k = so[i], v = second[i], kn = k + '_n';

    if (m = v.match(/<div>-<\/div>/)) {
        continue;
      } else if (m = v.match(/colPrice(.+?)<\/div>/)) {
        m = m[1].match(/>([\d,]+)</);
        m && (r[k] = m[1].replace(',', ''));

        if (m = v.match(/<b>(\d+)<\/b>/)) {
          r[kn] = m[1];
        }
      } else {
        console.log(i + ': ' + v);
      }
  }

  return r;

  
}

exports.get = get;