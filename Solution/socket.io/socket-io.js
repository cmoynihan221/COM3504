
exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
      /**
       * it creates or joins a room
       */
      socket.on('create or join', function (room, userId) {
        socket.join(room);
        io.to(room).emit('joined', room, userId);
      });

      socket.on('chat', function (room, userId, chatText) {
        io.to(room).emit('chat', room, userId, chatText);
      });

      socket.on('draw', function (room, userId, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness) {
        io.to(room).emit('draw', room, userId, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness);
      });

      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });
}
