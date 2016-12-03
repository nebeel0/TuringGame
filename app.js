
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var pathname = __dirname + '/public/';
var appServer = http.createServer(app);
var io = require('socket.io')(appServer);

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next){
	console.log("/" + req.method);
	next();
})

app.get("/", function (req,res){
	res.sendfile(pathname + "index.html");
})
app.get("/chatService", function (req,res){
	res.sendfile(pathname + "chatService.html");
})
 
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});
 

//app.get("/", express.static(__dirname + '/public_username'));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



// Simple AI Type
var simpleAI = require('./simpleAI/simpleAI');
app.post('/question', simpleAI.question);

appServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
