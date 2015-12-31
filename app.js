// modules =================================================
require('dotenv').load();
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || 'development';
var passport = require('passport');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')({
  session: session
});
var methodOverride = require('method-override');
var cors = require('cors');
var fs = require('fs');

// configuration ===========================================
require('./config/mongo');

// Allow cross-origin resource sharing
app.use(cors());

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'secret',
  store: new MongoStore({
    url: require('./config/db').url
  }),
  resave: false,
  path: '/*',
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 2419200000
  }
}));
var check;

// routes ==================================================
require('./controllers/routes/index')(app);

// start app ===============================================
app.listen(port);
console.log('listening on port', port);

exports = module.exports = app;
