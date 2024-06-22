import { io } from "socket.io-client";

const socketInit = ({ user_id, tokenone }) => {
  return io('http://localhost:8080', {
    extraHeaders: {
      user_id,
    tokenone,
    },
  });

  // socket.on('connect', () => {
  //   console.log('Socket connected:', socket.id);
  // });

  // socket.on('connect_error', (error) => {
  //   console.error('Socket connection error:', error);
  // });

  
};

export default socketInit;