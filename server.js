var http = require('http');
var https = require('https');


var app = require('express')();
//app.listen(3000)



var https      = require("https");
var fs         = require("fs");
var key_file   = "./file.pem";
var cert_file  = "./file.crt";
var config     = {
  key: fs.readFileSync(key_file),
 cert: fs.readFileSync(cert_file)
};


https.globalAgent.options.rejectUnauthorized = false;


//var server = app.listen(3000, function() {
  //  console.log('Listening on port %d', server.address().port);
//});


var server = https.createServer(config,app).listen(3000);

var io = require('socket.io').listen(server);




//app.listen = function(){
  //server = https.createServer(config,app).listen(3000);;

  //return server.listen.apply(server, arguments);
//};




app.engine('jade', require('jade').__express);





app.set('views','./views');

app.set('view engine', 'jade');


//app.get('/', function(req, res) {
//	res.render('index', {title: 'Hey', message: 'Hello there!'});
//})


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/viewer', function (req, res) {
  res.sendfile(__dirname + '/view.html');
});



io.sockets.on('connection', function(socket) {

    console.log((new Date()) + ' Connection established.');

  	// When a user send a SDP message
  	// broadcast to all users in the room
  	socket.on('message', function(message) {
        console.log((new Date()) + ' Received Message, broadcasting: ' + message);
        socket.broadcast.emit('message', message);
            		socket.emit('joined', {'client_id': 5, 'id': 6});
            		console.log("Sent Join");

    });


  	socket.on('send_offer', function(message) {
        console.log((new Date()) + ' SDP RECEIVED!!: ' + message);
        socket.broadcast.emit('add_desc', message);

    });

 	socket.on('send_answer', function(message) {
        console.log((new Date()) + ' SDP RECEIVED!!: ' + message);
        socket.broadcast.emit('add_answer', message);

    });

    

	socket.on('ice', function(message) {
        console.log((new Date()) + ' SDP RECEIVED!!: ' + message);
        socket.broadcast.emit('ice_send', message);

    });

	socket.on('ice-to-host', function(message) {
        console.log((new Date()) + ' SDP RECEIVED!!: ' + message);
        socket.broadcast.emit('ice_send-host', message);

    });

    // When the user hangs up
    // broadcast bye signal to all users in the room
    socket.on('disconnect', function() {
        // close user connection
        console.log((new Date()) + " Peer disconnected.");
        socket.broadcast.emit('user disconnected');
    });

});
