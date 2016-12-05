
/**
 * Module dependencies.
 */
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const errorHandler = require('errorhandler');
const expressValidator = require('express-validator');

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var pathname = __dirname + '/public/';
var appServer = http.createServer(app);
var io = require('socket.io')(appServer);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const userController = require('./controllers/user');


/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');


/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(function (req, res, next){
	console.log("/" + req.method);
	next();
})
*/

/*
app.get("/", function (req,res){
  res.sendfile(pathname + "chatService.html");
})
*/
/**
 * Primary app routes.
 */

app.get("/chatService", function (req,res){
  res.sendfile(pathname + "chatService.html");
})
app.get("/", function (req,res){
  res.sendfile(pathname + "chatService.html");
})

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
 
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      socket.broadcast.emit('chat message', msg);
    });
    socket.on('bot check', function(msg){
      console.log('bot check: ' + msg);
      socket.broadcast.emit('bot check', msg);
    });
    socket.on('accuse message', function(msg){
      console.log('accuse message: ' + msg);
      socket.broadcast.emit('accuse message', msg);
    });
});


app.use(errorHandler());

// Simple AI Type
var simpleAI = require('./simpleAI/simpleAI');
app.post('/question', simpleAI.question);

appServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
