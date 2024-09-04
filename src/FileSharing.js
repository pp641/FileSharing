import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Filesharing = () => {
  const [socket, setSocket] = useState(null);
  const [newState, setNewState] = useState(true);
  const [file, setFile] = useState(null);
  const [currentSocketId, setCurrentSocketId] = useState(null);
  const [downlaodable , setDownloadable] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io( process.env.NODE_ENV === 'production' ? "https://file-sharing-okhttps//file-sharing-ok3a-1tpjf9v8h-pp641s-projects.vercel.app" : "http://localhost:5000"  , {
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setCurrentSocketId(socketInstance.id);
    });

    socketInstance.on('test-connect', () => {
      console.log('hello test connect');
    });

    socketInstance.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      const { fileName, fileData, senderId } = message;
     if(senderId !== socketInstance.id){ 
        const blob = new Blob([fileData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        setDownloadable({ url, fileName });
    }
    });



    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from server');
    };
  }, []);

  const doShare = () => {
      console.log('okodok');
    if (socket) {
      socket.emit('share-event', { data: 'some data' }, (response) => {
        console.log('Server responded with:', response);
      });

      socket.emit('696969', { data: 'some datass' }, (response) => {
        console.log('Server responded with:', response);
      });

    } else {
      console.log('Socket is not connected');
    }
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const sendMessage = () => {
    if (socket && file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit('sendMessage', { fileName: file.name, fileData: reader.result });
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.log('Socket is not connected or no file selected');
    }
  };
  

  return (
    <div className="App">
      <h1>Socket.io Client Connection</h1>
      <h1>
        Share some files: <button onClick={doShare}>Do</button>
      </h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendMessage}>Send Broadcast Message</button>
      {downlaodable === null ? ""  : (
        <div>
          <a href={downlaodable?.url} download={downlaodable?.fileName}>
            <button>Download {downlaodable?.fileName}</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Filesharing;
