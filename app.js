
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use("/", express.static(__dirname + '/public'));

// Travel Chat Demo AI Type
// Note: comment out the undesired AI
// Method 1: Simple AI
//var simpleAI = require('./simpleAI/simpleAI');
//app.post('/question', simpleAI.question);
// Method 2: Watson AI
var simpleAI = require('./simpleAI/simpleAI');
app.post('/question', simpleAI.question);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
