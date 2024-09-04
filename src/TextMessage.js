import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const TextMessage = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io( process.env.NODE_ENV === 'production' ? "https://file-sharing-okhttps//file-sharing-ok3a-1tpjf9v8h-pp641s-projects.vercel.app" : "http://localhost:5000"  , {
      transports: ['websocket', 'polling'],
    });
    
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('receiveTextMessage', (message) => {
      console.log('Received message:', message);
      setReceivedMessages(message);
    });

    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from server');
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (socket && message) {
      socket.emit('sendTextMessage', message);
    } else {
      console.log('Socket is not connected or message is empty');
    }
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('sendTextMessage', message);
      setMessage('');
    } else {
      console.log('Socket is not connected or message is empty');
    }
  };

  return (
    <div className="App">
      <h1>Socket.io Client Connection</h1>
      <textarea 
        type="text" 
        value={message} 
        onChange={handleInputChange} 
        placeholder="Enter your message"
      />

      <h2>Broadcasted Messages:</h2>
     <textarea>{receivedMessages}</textarea>
    </div>
  );
};

export default TextMessage;
