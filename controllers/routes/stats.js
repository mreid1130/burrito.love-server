var async = require('async');
var Action = mongoose.model('Action');
var Score = mongoose.model('Score');
var jwt = require('jsonwebtoken');

module.exports = function(app) {
  app.post('/stats/countplay', function(req, res) {
    if (!req.body.game) {
      return res.send({
        error: 'no game found'
      });
    }
    var user;
    var newAction = {
      game: req.body.game,
      type: 'play'
    };
    if (req.body.jwt) {
      try {
        user = jwt.verify(req.body.jwt, 'secret')
      } catch (err) {
        console.log(err.stack);
        // TODO: return error to client to handle error (re-login most likely)
      }
    }
    if (user && user._id) {
      newAction.user = user._id;
    }
    new Action(newAction).save(function(err, doc) {
      if (!err) {
        res.send({
          success: 'game play counted'
        });
      } else {
        res.send({
          error: err.message
        });
      }
    });
  });

  app.post('/stats/highScore', function(req, res) {
    if (!req.body.game) {
      return res.send({
        error: 'no game found'
      });
    }
    var user;
    var newScore = {
      game: req.body.game,
      type: 'play',
      time: req.body.time,
      burritosEaten: req.body.burritosEaten,
      opponentsTackled: req.body.opponentsTackled,
      shipsDestroyed: req.body.shipsDestroyed,
      asteroidsDestroyed: req.body.asteroidsDestroyed,
      wallsDestroyed: req.body.wallsDestroyed
    };
    if (req.body.jwt) {
      try {
        user = jwt.verify(req.body.jwt, 'secret')
      } catch (err) {
        console.log(err.stack);
        // TODO: return error to client to handle error (re-login most likely)
      }
    }
    if (user && user._id) {
      newScore.user = user._id;
    }
    new Score(newScore).save(function(err, doc) {
      if (!err) {
        res.send({
          success: 'game play counted'
        });
      } else {
        res.send({
          error: err.message
        });
      }
    });
  });
};
