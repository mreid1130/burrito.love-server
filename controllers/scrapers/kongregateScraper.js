var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var FlashGame = mongoose.model('FlashGame');

var getGames = function(next) {
  var games = [];
  async.waterfall([
    function(callback) {
      request('http://www.kongregate.com/games_for_your_site.xml', callback);
    },
    function(res, body, callback) {
      var $ = cheerio.load(body, {
        lowerCaseTags: true,
        lowerCaseAttributeNames: true,
        xmlMode: true
      });
      $('game').each(function(i, elem) {
        var thirdPartyId = $(elem).find('id').text().trim();
        var title = $(elem).find('title').text().trim();
        var thumbnail = $(elem).find('thumbnail').text().trim();
        var category = $(elem).find('category').text().trim();
        var flashFileUrl = $(elem).find('flash_file').text().trim();
        var instructions = $(elem).find('instructions').text().trim();
        var description = $(elem).find('description').text().trim();
        var developerName = $(elem).find('developer_name').text().trim();
        var height = $(elem).find('height').text().trim();
        var width = $(elem).find('width').text().trim();
        var kongregateUrl = $(elem).find('url').text().trim();
        games.push({
          thirdPartyId: thirdPartyId,
          thirdPartyName: 'Kongregate',
          title: title,
          thumbnail: thumbnail,
          category: category,
          flashFileUrl: flashFileUrl,
          instructions: instructions,
          description: description,
          developerName: developerName,
          height: height,
          width: width,
          thirdPartyUrl: kongregateUrl
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
  var kongregateGames = {};
  async.waterfall([
    function(callback) {
      getGames(callback);
    },
    function(docs, callback) {
      if (docs.length) {
        games = docs;
      }
      FlashGame.find({
        thirdPartyName: 'Kongregate'
      }).exec(callback);
    },
    function(docs, callback) {
      docs.forEach(function(doc) {
        kongregateGames[doc.thirdPartyId] = doc;
      });
      async.eachSeries(games, function(game, cb) {
        if (!kongregateGames[game.thirdPartyId]) {
          var newGame = new FlashGame(game);
          newGame.save(cb);
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
