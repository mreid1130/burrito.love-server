var async = require('async');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

  app.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
      return res.send({
        error: 'missing parameters'
      });
    } else {
      async.waterfall([
        function(callback) {
          User.findOne({
            'local.email': req.body.email
          }).exec(callback);
        },
        function(user, callback) {
          if (!user) {
            return callback(new Error('email not found'));
          }
          if (user.validPassword(req.body.password)) {
            callback(null, user);
          } else {
            callback(new Error('invalid password'));
          }
        }
      ], function(err, data) {
        if (err) {
          console.log(err.stack);
          return res.send({
            error: err.message
          });
        } else {
          return res.status(200).send({
            success: {
              user: data,
              jwt: jwt.sign(data, 'secret', {
                expiresIn: '7d'
              })
            }
          });
        }
      });
    }
  });

  app.post('/signup', function(req, res) {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      return res.send({
        error: 'missing parameters'
      });
    } else {
      async.waterfall([
        function(callback) {
          User.findOne({
            'local.email': req.body.email
          }).exec(callback);
        },
        function(user, callback) {
          if (user) {
            return callback(new Error('email already registered'));
          }
          user = new User({
            local: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email
            }
          });
          user.local.password = user.generateHash(req.body.password);
          user.save(callback);
        }
      ], function(err, data) {
        if (err) {
          return res.send({
            error: err.message
          });
        } else {
          return res.status(200).send({
            success: {
              user: data,
              jwt: jwt.sign(data, 'secret', {
                expiresIn: '7d'
              })
            }
          });
        }
      });
    }

  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.send('done');
  });
};
