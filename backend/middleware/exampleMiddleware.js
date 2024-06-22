const example = (socket, next) => {
    if (socket[0] !== "message") {
      next(new Error("Socket middleware Error"));
    } else {
      next();
    }
  };
  
  module.exports = example;
  