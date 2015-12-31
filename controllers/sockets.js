var jwt = require('jsonwebtoken');
module.exports = function(wss) {

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };
  // var activeSockets = [];

  wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
      try {
        message = JSON.parse(message);
      } catch (err) {
        console.log(err.stack);
        return false;
      }
      console.log(message);
      if (message.send) {
        var user = jwt.verify(message.send.jwt, process.env.JWT_SECRET);
        console.log(user);
        wss.broadcast(JSON.stringify({
          name: message.send.name,
          message: message.send.message
        }));
      }

    });

  });

};
