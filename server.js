var http = require('http');
var express = require('express');


var app = express();
app.engine('jade', require('jade').__express);

app.set('views','./views');

app.set('view engine', 'jade');


app.get('/', function(req, res) {
	res.render('index', {title: 'Hey', message: 'Hello there!'});
})

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
