import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const FileSharing = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const [downloadable, setDownloadable] = useState(null);

  useEffect(() => {
    // Initialize socket connection with room ID
    const socketInstance = io('http://192.168.1.7:5000/', {
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      socketInstance.emit('joinRoom', id); // Join the room with the ID
    });

    socketInstance.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      const { fileName, fileData, senderId , roomId } = message;
      console.log("ok coming", message);
      if ((senderId !== socketInstance.id) && (roomId === id )) {
        const blob = new Blob([fileData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        setDownloadable({ url, fileName });
      }
    });

    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from server');
    };
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessage = () => {
    if (socket && file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit('sendMessage', { fileName: file.name, fileData: reader.result, roomId: id });
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.log('Socket is not connected or no file selected');
    }
  };

  return (
    <div className="App">
      <h1>File Sharing Room: {id}</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendMessage}>Send File</button>
      {downloadable && (
        <div>
          <a href={downloadable.url} download={downloadable.fileName}>
            <button>Download {downloadable.fileName}</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default FileSharing;
