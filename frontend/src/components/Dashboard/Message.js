import React, { useContext, useEffect, useState } from 'react';
import './Message.css';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../App';

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

    const sendMessage = () => {
        if (isLoggedIn) {
            const messageData = isProvider 
                ? { to: userId, from: user_id, message, userImage }
                : { to: providerId, from: user_id, message, userImage };

            socket?.emit("message", messageData);
            setMessage("");
        }
    };

    const receiveMessage = (data) => {
        setAllMessages((prevMessages) => [...prevMessages, data]);
        setShowPopup(true);  
        setNotification(`New message from ${data.from}`);
    };

    const clearMessages = () => {
        setAllMessages([]);
    };

    return (
        <>
            {showPopup && (
                <div className="notification-popup">
                    <p>{notification}</p>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}
            <div className={`popup ${showPopup ? 'show' : ''}`} id='message'>
                <div className='popup-header'>
                    <h2>Chat</h2>
                    <span className='close' onClick={() => setShowPopup(false)}>&times;</span>
                </div>
                <div className='popup-content'>
                    <input 
                        type='text' 
                        placeholder='Type a message...' 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} 
                    />
                    <input 
                        type='text' 
                        placeholder='Recipient ID' 
                        value={providerId || userId}
                        onChange={(e) => setTo(e.target.value)} 
                    />
                    <button onClick={sendMessage}>Send</button>
                    <button onClick={clearMessages}>Clear Messages</button> 
                    <div className="messages">
                        {allMessages.length > 0 && allMessages.map((msg, index) => (
                            <div key={index} className={`message-item ${msg.from === userName ? 'from-me' : 'from-other'}`}>
                                <div className="message-content">
                                    <img src={msg.userImage || 'default-avatar.png'} alt={`${msg.from}'s avatar`} />
                                    <p><strong>{msg.from}:</strong> {msg.message}</p>
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
