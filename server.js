var http = require('http');
var https = require('https');


var app = require('express')();
//app.listen(3000)


var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    bodyParser = require('body-parser');


//passport stuff
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());



var https      = require("https");
var fs         = require("fs");
var key_file   = "./file.pem";
var cert_file  = "./file.crt";
var config     = {
  key: fs.readFileSync(key_file),
 cert: fs.readFileSync(cert_file)
};


https.globalAgent.options.rejectUnauthorized = false;


// Session-persisted message middleware

app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});
//var server = app.listen(3000, function() {
  //  console.log('Listening on port %d', server.address().port);
//});


var server = https.createServer(config,app).listen(3000);

var io = require('socket.io').listen(server);

var db = require('./models');


rooms = [];
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

app.get('/connect/:room', function(req, res) {
	res.sendfile(__dirname + '/connect.html');
});

app.get('/viewer', function (req, res) {
  res.sendfile(__dirname + '/view.html');
});

app.get('/viewer/:room', function(req,res){

	var roomid = req.params.room;
	var query = db.Room.where({id: roomid});

	query.findOne(function(err, room) {
		if (err) return handleError(err);
			if(room){
				console.log("ROOM" + room);
				if (!rooms[roomid]){
				rooms[roomid] = true;
				var nsp = io.of('/' + roomid);
			//	nsp.on('connection', function(socket){
				//				  console.log('someone connected');
				//});

nsp.on('connection', function(socket) {

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
}

				}
		});
	console.log(req.params.room);
	res.sendfile(__dirname + '/viewit.html');
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
