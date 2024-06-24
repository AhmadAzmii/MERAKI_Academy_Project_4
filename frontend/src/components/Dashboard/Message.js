import React, { useContext, useEffect, useState, useRef } from "react";
import "./Message.css";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../App";
import notificationSound from "../../alphabetImages/Message.mp3";
const Message = ({ socket, providerId, userId, image }) => {
  const { isLoggedIn, isProvider } = useContext(UserContext);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const token = localStorage.getItem("token");
  const [user_id, setUser_id] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState("");

  const audioRef = useRef(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUser_id(userId);
      const userName = decodedToken.user;
      const userImage = decodedToken.image;
      setUserName(userName);
      setUserImage(image);
    }
  }, [token]);

  useEffect(() => {
    socket?.on("message", receiveMessage);
    return () => {
      socket?.off("message", receiveMessage);
    };
  }, [socket]);
  const getDefaultImage = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase();
    if (firstLetter) {
      return require(`../../alphabetImages/${firstLetter}.png`);
    }
  };
  const getImage = (image, name) => {
    return image || getDefaultImage(name);
  };
  const sendMessage = () => {
    if (isLoggedIn) {
        console.log(userImage);
      const messageData = isProvider
        ? { to: userId, 
            from: user_id, 
            fromName: userName, message, 
            userImage }
        : {
            to: providerId,
            from: user_id,
            fromName: userName,
            message,
            userImage,
          };
      console.log(messageData);

      socket?.emit("message", messageData);
      setMessage("");
    }
  };

  const receiveMessage = (data) => {
    console.log(data);
    setAllMessages((prevMessages) => [...prevMessages, data]);
    setShowPopup(true);
    setNotification(`New message from ${data.from}`);

    // if (audioRef.current) {
    //   audioRef.current.play();
    // }

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const clearMessages = () => {
    setAllMessages([]);
  };

  return (
    <>
      <audio ref={audioRef} src={notificationSound} />

      {showPopup && (
        <div className="notification-popup">
          <p>{notification}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
      <div className={`popup ${showPopup ? "show" : ""}`} id="message">
        <div className="popup-header">
          <h2>Chat </h2>
          <span className="close" onClick={() => setShowPopup(false)}>
            &times;
          </span>
        </div>
        <div className="popup-content">
          <input
            className="message-input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            className="message-input"
            type="hidden"
            placeholder="Recipient ID"
            value={providerId || userId}
            onChange={(e) => setTo(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={clearMessages}>Clear Messages</button>
          <div className="messages">
            {allMessages.length > 0 &&
              allMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-item ${
                    msg.from === userName ? "from-me" : "from-other"
                  }`}
                >
                  <div className="message-content">
                    <img
                      src={getImage(msg.userImage,msg.fromName) || "default-avatar.png"}
                      alt={`${msg.from}'s avatar`}
                    />
                    <p>
                      <strong>{msg.fromName}:</strong> {msg.message}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
