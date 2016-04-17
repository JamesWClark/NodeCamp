// // // // // // //
// NodeCamp v1.0  //
// // // // // // //


// GLOBALS
var http = require('http');
var fs = require('fs');

var users = [];


function simpleStringify(object) {
    // http://stackoverflow.com/a/31557814/1161948
    var simpleObject = {};
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof (object[prop]) == 'object') {
            continue;
        }
        if (typeof (object[prop]) == 'function') {
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
}

function logPropertiesOfObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log(key + " -> " + obj[key]);

            if (obj[key] !== null && typeof obj[key] === 'object') {
                console.log(simpleStringify(obj[key]));
            }
        }
    }
}


// SIMPLE SOCKET SERVER
var server = http.createServer().listen(3000, '127.0.0.1');
var io = require('socket.io').listen(server);

// SINGLE CLIENT CONNECTION
io.sockets.on('connection', function (socket) {

    console.log('user connected');
    logPropertiesOfObject(socket);

    socket.on('disconnect', function () {
        if (!socket.user) {
            return;
        }
        if (users.indexOf(socket.user) > -1) {
            console.log(socket.user.id + ' disconnected');
            users.splice(users.indexOf(socket.user), 1);
            socket.broadcast.emit('otherUserDisconnect', socket.user);
        }
        console.log('users: ' + users.length);
    });

    socket.on('user', function (user) {
        console.log(user.id + ' connected');
        users.push(user);
        socket.user = user;
        console.log('users : ' + users.length);
        socket.broadcast.emit('otherUserConnect', user);
    });

    socket.on('msg', function (msg) {
        io.sockets.emit('msg', {
            user: socket.user,
            data: msg
        });
    });

    socket.emit('welcome', {
        text: 'OH HAI! U R CONNECTED '
    });

});

console.log('Server running at http://127.0.0.1:3000/');
