const messageHandler = (socket, io) => {
  socket.on("message", (data) => {
    console.log("Message received:", data);
    data.success = true;
    socket.to("room-" + data.to).emit("message", data);
    socket.emit("message", data);
  });
};

module.exports = messageHandler;
