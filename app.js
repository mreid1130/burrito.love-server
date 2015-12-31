// modules =================================================
require('dotenv').load();
var express = require('express');
app = express();
var port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')({
  session: session
});
var methodOverride = require('method-override');
var fs = require('fs');
var http = require('http');
var server = http.createServer(app);
var WebSocketServer = require('ws').Server;
var cors = require('cors');
var wss = new WebSocketServer({
  server: server
});
// configuration ===========================================
require('./config/mongo');

app.use(cors());
// Allow cross-origin resource sharing
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
// var io = require('socket.io')(server);

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'secret',
  resave: false,
  path: '/*',
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 2419200000
  }
}));

// routes ==================================================
require('./controllers/routes/index')(app);

// start app ===============================================
require('./controllers/sockets.js')(wss);
server.listen(port);

console.log(server.address());

console.log('listening on port', port);

exports = module.exports = app;
