function getCookie (arrCookies) {
  if (typeof arrCookies === 'string') {
    arrCookies = [arrCookies];
  }
  var cookie = '';
  for (var i = 0, j = arrCookies.length; i < j; i++) {
    cookie += arrCookies[i].match(/^[^;]+;/)[0] + ' ';
  }
  return cookie.slice(0, -2);
}
function escapeRegStr (s) {
  return s.replace(/[*.?+$^[\](){}|\\\/]/g, function (c) {
    return '\\' + c;
  });
}
function getValueFromStr (key, str) {
  var m = str.match(new RegExp('\\b' + escapeRegStr(key) + '=([^;\\s]*)'));
  return m ? m[1] : null;
}

exports.getCookies = getCookie;
exports.getCookieByName = getValueFromStr;