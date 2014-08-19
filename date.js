function get(d, needTime) {
  d = d || new Date();
  return getDate(d) + (needTime ? (' ' + getTime(d)) : '');
}
function getDate(d) {
  d = d || new Date();
  return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();
}
function getTime(d) {
  d = d || new Date();
  return d.getHours() + ':' + d.getMinutes();
}
function getNextDate(d) {
  if (typeof d === 'string') {
    d = new Date(Date.parse(d));
  } else if (typeof d === 'undefined') {
    d = new Date();
  }
  d.setDate(d.getDate() + 1);
  return getDate(d);
}

exports.get = get;
exports.getDate = getDate;
exports.getTime = getTime;
exports.getNextDate = getNextDate;