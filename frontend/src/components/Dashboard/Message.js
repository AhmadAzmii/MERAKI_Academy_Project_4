import React, { useContext, useEffect, useState } from 'react';
import './Message.css';
import {jwtDecode} from 'jwt-decode';
import { UserContext } from '../../App';

const Message = ({ socket, providerId, userId }) => {
    const { isLoggedIn, isProvider } = useContext(UserContext);
    const [to, setTo] = useState("");
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const token = localStorage.getItem("token");
    const [user_id, setUser_id] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUser_id(userId);
            const userName = decodedToken.user;
            console.log(decodedToken);
            setUserName(userName);
        }
    }, [token]);

    useEffect(() => {
        socket?.on("message", receiveMessage);
        console.log(providerId);
        return () => {
            socket?.off("message", receiveMessage);
        };
    }, [socket]);

    const sendMessage = () => {
        if (isLoggedIn) {
            if (isProvider) {
                socket?.emit("message", { to: userId, from: user_id, message });
            } else {
                socket?.emit("message", { to: providerId, from: user_id, message });
            }
            setMessage(""); 
        }
    };

    const receiveMessage = (data) => {
        setAllMessages((prevMessages) => [...prevMessages, data]);
        console.log(data);
    };

    return (
        <div className='Message'>
            <h2>Chat</h2>
            <input 
                type='text' 
                placeholder='message' 
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
            />
            <input 
                type='text' 
                placeholder='to' 
                value={providerId || userId}
                onChange={(e) => setTo(e.target.value)} 
            />
            <button onClick={sendMessage}>
                Send 
            </button>
            <div className="messages">
                {allMessages.length > 0 && allMessages.map((msg, index) => (
                    <p key={index} className={msg.from === userName ? 'from-me' : 'from-other'}>
                        <small>{msg.from}: {msg.message}</small>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Message;
