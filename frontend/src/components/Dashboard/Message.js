import React, { useEffect, useState } from 'react';
import './Message.css'
import {jwtDecode} from 'jwt-decode';
const Message = ({ socket, providerId ,providerUserName}) => {
    const [to, setTo] = useState("");
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const token=localStorage.getItem("token")
    const [user_id, setUser_id] = useState("")
    const [userName, setUserName] = useState("")
    useEffect(()=>{
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUser_id(userId);
            const userName=decodedToken.user;
            console.log(decodedToken);
            setUserName(userName)
          }
    },[token])
    useEffect(() => {
        socket?.on("message", receiveMessage);
        console.log(providerId);
        return () => {
            socket?.off("message", receiveMessage);
        };
    }, [socket]);

    const sendMessage = () => {
        socket?.emit("message", { to: providerId, from:userName, message });
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
                value={providerId}
                
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
