module.exports = function(io) {
  var activeSockets = [];
  io.on('connection', function(socket) {

    activeSockets.push(socket);

    socket.on('send', function(data) {
      if (data.message && data.name) {
        io.sockets.emit('message', {
          name: data.name,
          message: data.message
        });
        // activeSockets.forEach(function(activeSocket) {
        //   activeSocket.emit('message', {
        //     name: data.name,
        //     message: data.message
        //   });
        // });
      } else {
        console.log('error getting full message data');
      }
    })

    socket.on('disconnect', function() {
      try {
        activeSockets.splice(activeSockets.indexOf(socket), 1);
      } catch (err) {
        console.log(err);
      }
    });
  });
}
