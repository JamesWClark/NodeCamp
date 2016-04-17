// // // // // // //
// NodeCamp v1.0  //
// // // // // // //


// GLOBALS
var http = require('http');
var fs = require('fs');

// http://stackoverflow.com/a/31557814/1161948
function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};

function logPropertiesOfObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      console.log(key + " -> " + obj[key]);
      
      if(obj[key] !== null && typeof obj[key] === 'object') {
        console.log(simpleStringify(obj[key]));
      }
    }
  }
}


// SIMPLE SOCKET SERVER
var server = http.createServer().listen(3000, '127.0.0.1');
var io = require('socket.io').listen(server);

// SINGLE CLIENT CONNECTION
io.sockets.on('connection', function(socket) {
  
  console.log('user connected');
  logPropertiesOfObject(socket);
  
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  
  console.log('socketId = ' + socketId);
  console.log('clientIp = ' + clientIp);
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  
  
});

console.log('Server running at http://127.0.0.1:3000/');