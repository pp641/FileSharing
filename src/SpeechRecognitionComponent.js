import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SpeechRecognitionComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage , setReceivedMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
   

    const socketInstance = io( process.env.NODE_ENV === 'production' ? "https://file-sharing-okhttps//file-sharing-ok3a-1tpjf9v8h-pp641s-projects.vercel.app" : "http://localhost:5000"  , {
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('receiveVoiceMessage', (receivedMessage) => {
      console.log('Received message:', receivedMessage);
      setReceivedMessage(receivedMessage);
      setMessage("");
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

 
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';

    speechRecognition.onstart = () => {
      setIsListening(true);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    setRecognition(speechRecognition);
  }, []);

  useEffect(() => {
    if (receivedMessage) {
      speakText(receivedMessage);
    }
  }, [receivedMessage]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.emit('sendVoiceMessage', message); 
      setMessage(''); 
    } else {
      console.log('No message to send or socket is not connected');
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      console.log('Speaking:', text);
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };
    window.speechSynthesis.speak(utterance);
  };


  return (
    <div className="App">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Your message will appear here..."
        rows="4"
        cols="50"
      />
      <button onClick={sendMessage}>Send Message</button>
      <div> Received :: {receivedMessage}</div>
      <h1>Speech to Text Broadcasting</h1>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>
    </div>
  );
};

export default  SpeechRecognitionComponent;
