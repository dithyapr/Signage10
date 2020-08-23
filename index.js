// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var opn = require('opn');
var port = process.env.PORT || 3000;
var mysql = require('mysql'); 
var robot = require('robotjs');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signage"
});

var id
var url0
var url1
var url2
var url3
var url4
var url5
var url6
var url7
var url8
var url9
var url10



server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

io.on('connection', (socket) => {
  var addedUser = false;


  con.connect(function(err) {
  if (err) throw err;
});




  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    console.log(data);
    con.query("SELECT * FROM signurl", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    robot.keyTap("f11");
    });

    // switch(id)
    // {
    //   case "1"
    //   break;

    //   case "2"
    //   break;

    //   case "3"
    //   break;

    //   case "4"
    //   break;

    //   case "5"
    //   break;

    //   case "6"
    //   break;

    //   case "7"
    //   break;

    //   case "8"
    //   break;

    //   case "9"
    //   break;

    //   case "10"
    //   break;

    //   default:
    //   opn('google.com');
    // }

    // switch(data)
    // {
    //   case "0":
    //   opn('http://google.com', {app: 'firefox'});
    //   console.log(result[0].url)
    //   break;

    //   case "1":

    //   opn('http://facebook.com', {app: 'firefox'});
    //   break;

    //   case 2:
    //   break;

    //   case 3:
    //   break;

    //   case 4:
    //   break;


    //   default:
    //   opn('google.com');

    // }
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });

  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
