var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var settings = require("./settings");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var flash = require("connect-flash");

var index = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');
var logout = require('./routes/logout');
var register = require('./routes/register');
var post = require('./routes/post');
var uploads = require('./routes/upload');

var app = express();

//data store
app.use(session({
  secret:settings.cookieSecret,
  key:settings.db,
  cookie:{maxAge:1000*60*60*24},
  store:new MongoStore({
    db:settings.db,
    host:settings.host,
    port:settings.port
  })
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', login);
app.use('/', users);
app.use('/', register);
app.use('/', logout);
app.use('/', post);
app.use('/', uploads);




app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
