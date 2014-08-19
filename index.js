var con = require('./con.js'),
    date = require('./date.js'),
    DB = require('./db.js'),
    parms = require('commander'),
    config = require('./config.json');

parms
  .option('-c, --cookie []', 'query cookie')
  .option('-f, --from []', 'origin')
  .option('-t, --to []', 'destination')
  .option('-d, --date []', '2014/08/20')
  .parse(process.argv);

var collection = 'airchina', db = new DB();

var today  = date.getDate(),
    cookie = parms.cookie || config.cookie,
    from = parms.from || config.from, 
    to = parms.to || config.to, 
    day = parms.date || date.getDate(),
    MAX = config.MAX || 21,
    i = 0;

if (!(cookie && from && to)) {
  console.log('wrong usage, -h for help');
  return;
}

con.init(from, to, cookie);

function get() {
  if (i++ >= MAX) { console.log('done'); return; }
  console.log('getting ' + day + ' data...');
  con.get(day, function (data) {
    if (!data) {
      console.log('get data err');
      return;
    }
    db.write(collection, data);

    day = date.getNextDate(day);

    setTimeout(function () { get(); }, getRandom(10, 15)*1000);

  });
}

get();



/*---------- helper -------------*/

function getRandom(min, max) {
  return Math.floor(Math.random()*(max-min+1)) + min;
}





