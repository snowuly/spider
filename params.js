function trans (from, to, date) {

  var p = {
    'tripType':'OW',
    'directFlightsOnly': true,
    'searchType':'FARE',
    'flexibleSearch':false,
    'outboundOption.originLocationCode':'PEK',
    'outboundOption.destinationLocationCode':'PVG',
    'outboundOption.departureDay':'',
    'outboundOption.departureMonth':'',
    'outboundOption.departureYear':'',
    'outboundOption.departureDate': date,
    'outboundOption.departureTime':'NA',
    'guestTypes[0].type':'ADT',
    'guestTypes[0].amount':1,
    'guestTypes[1].type':'CNN',
    'guestTypes[1].amount':0,
    'guestTypes[2].type':'INF',
    'guestTypes[2].amount':0,
    'cabinClass': 'Economy'
  };


  from && (p['outboundOption.originLocationCode'] = from);
  to && (p['outboundOption.destinationLocationCode'] = to);

  if (date) {
    date = date.split('/');
    p['outboundOption.departureYear'] = date[0];
    p['outboundOption.departureMonth'] = date[1];
    p['outboundOption.departureDay'] = date[2];
  } 

  var r = '';
  for (var i in p) {
    r += encodeURIComponent(i) + '=' + encodeURIComponent(p[i]) + '&';
  }

  return r.slice(0, -1);

}
exports.get = trans;