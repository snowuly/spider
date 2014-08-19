var client = require('mongodb');

var dbname = 'stone', db, 
    connected = -1, 
    dataQueue = {};

function connect (callback) {
  client.connect('mongodb://127.0.0.1/' + dbname, {native_parser:true}, function (err, _db) {

    if (err) { console.log('err'); return; }

    console.log('db connect successfully'); 

    db = _db;
    callback();

  });
}



function DB (name) {
  if (name) { dbname = name; }
}
DB.prototype.write = function (collection, data) {
  if (connected <= 0) {
    if (!dataQueue[collection]) {
      dataQueue[collection] = [];
    }
    dataQueue[collection] = dataQueue[collection].concat(data);;

    if (connected < 0) {
      connected = 0;
      connect(function () {
        connected = 1;
        for (var i in dataQueue) {
          db.collection(i).insert(dataQueue[i], function (err) {
            if (err) { throw err; }
            console.log('db write successfully');
          });
        }
        dataQueue = {};
      })
    }  
  } else {
    db.collection(collection).insert(data, function (err) {
      if (err) { throw err; }
      console.log('db write successfully...');
    });
  }

};
DB.prototype.close = function () {
  db.close();
  connected = -1;
};
DB.prototype.flush = function () {

};

module.exports = DB;


