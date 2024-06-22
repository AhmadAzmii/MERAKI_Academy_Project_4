const auth = (socket, next) => {
    const headers = socket.handshake.headers;
    console.log("From auth");
    if (!headers.tokenone) {
        next(new Error("invalid"));
    } else {
        socket.join("room-" + headers.user_id);
        socket.user = { tokenone: headers.tokenone, user_id: headers.user_id };
        next();
    }
};

module.exports = auth;
