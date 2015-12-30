var async = require('async');
var jwt = require('jsonwebtoken');

module.exports = function(app) {
  app.get('/ping', function(req, res) {
    res.send('pong');
  });

  app.get('/404', function(req, res) {
    res.status(404);
  });
};
