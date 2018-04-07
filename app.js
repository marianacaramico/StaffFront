var express = require('express');
var session = require('express-session');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

// routes path
var index = require('./routes/index');
var task = require('./routes/task');
var user = require('./routes/user');
var profile = require('./routes/profile');
var login = require('./routes/login');
var signup = require('./routes/signup');
var home = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({ secret: 'first5secret' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', function(req, res, next) {
  if (req.app.get('env') !== 'development') {
    if (!(req.secure || req.headers['x-forwarded-proto'] == 'https')) {
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/', index);
app.use('/task', task);
app.use('/user', user);
app.use('/profile', profile);
app.use('/login', login);
app.use('/signup', signup);
app.use('/home', home);

app.use('/logout', function(req, res, next) {
  req.session.userid = undefined;
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404: Page Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Erro'
  });
});

module.exports = app;