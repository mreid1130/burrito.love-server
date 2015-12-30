var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var FlashGame = mongoose.model('FlashGame');

var getGames = function(next) {
  var games = [];
  async.waterfall([
    function(callback) {
      request('http://www.freegamesforyourwebsite.com/feeds/games/?category=all&limit=100000', callback);
    },
    function(res, body, callback) {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return callback(err);
      }

      body.forEach(function(game) {
        var thirdPartyId = game.id;
        var title = game.title.trim();
        var thumbnail = game.small_thumbnail_url.trim();
        var category = game.category.trim();
        var flashFileUrl = game.swf_file.trim();
        var instructions = game.controls.trim();
        var description = game.description.trim();
        var height = game.resolution.trim();
        var width = game.resolution.trim();
        var freegameUrl = game.game_url.trim();
        games.push({
          thirdPartyId: thirdPartyId,
          thirdPartyName: 'freegamesforyourwebsite',
          title: title,
          thumbnail: thumbnail,
          category: category,
          flashFileUrl: flashFileUrl,
          instructions: instructions,
          description: description,
          height: height,
          width: width,
          thirdPartyUrl: freegameUrl
        });
      });
      callback(null);
    }
  ], function(err) {
    if (err) {
      console.log(err.stack);
    }
    next(null, games);
  });
};

module.exports.run = function(next) {
  var games = [];
  var freegameGames = {};
  async.waterfall([
    function(callback) {
      getGames(callback);
    },
    function(docs, callback) {
      if (docs.length) {
        games = docs;
      }
      FlashGame.find({
        thirdPartyName: 'freegamesforyourwebsite'
      }).exec(callback);
    },
    function(docs, callback) {
      docs.forEach(function(doc) {
        freegameGames[doc.thirdPartyId] = doc;
      });
      async.eachSeries(games, function(game, cb) {
        if (!freegameGames[game.thirdPartyId]) {
          var newGame = new FlashGame(game);
          newGame.save(cb);
        } else if (freegameGames[game.thirdPartyId].thumbnail !== game.thumbnail) {
          freegameGames[game.thirdPartyId].thumbnail = game.thumbnail;
          freegameGames[game.thirdPartyId].save(cb);
        } else {
          cb(null);
        }
      }, callback);
    }
  ], function(err) {
    if (err) {
      console.log(err.stack);
    }
    next(null);
  });
};
