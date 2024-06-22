import React, { useEffect, useState } from 'react';
import './Message.css'
const Message = ({ socket, userId }) => {
    const [to, setTo] = useState("");
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        socket.on("message", receiveMessage);

        return () => {
            socket.off("message", receiveMessage);
        };
    }, [socket]);

    const sendMessage = () => {
        socket.emit("message", { to, from: userId, message });
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
                value={to}
                onChange={(e) => setTo(e.target.value)} 
            />
            <button onClick={sendMessage}>
                Send 
            </button>
            <div className="messages">
                {allMessages.length > 0 && allMessages.map((msg, index) => (
                    <p key={index} className={msg.from === userId ? 'from-me' : 'from-other'}>
                        <small>{msg.from}: {msg.message}</small>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Message;
