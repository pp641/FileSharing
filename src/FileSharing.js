import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const FileSharing = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const [userCount, setUserCount] = useState(0); 
  const [downloadable, setDownloadable] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress

  useEffect(() => {
    // Initialize socket connection with room ID
    const socketInstance = io('http://192.168.1.7:5000/', {
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      socketInstance.emit('joinRoom', id); 
    });

    socketInstance.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      const { fileName, fileData, senderId, roomId } = message;
      if (senderId !== socketInstance.id && roomId === id) {
        const blob = new Blob([fileData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        setDownloadable({ url, fileName });
      }
    });

  socketInstance.on('userCountUpdate', (count, users) => {
    console.log("All Connected Users list here ",  count, users )
      setUserCount(count);
    });

    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from server');
    };
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0); // Reset progress when a new file is selected
  };

  const sendMessage = () => {
    if (socket && file) {
      const reader = new FileReader();

      // Update progress as the file is being read
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentCompleted);
        }
      };

      reader.onload = () => {
        socket.emit('sendMessage', {
          fileName: file.name,
          fileData: reader.result,
          roomId: id,
        });
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.log('Socket is not connected or no file selected');
    }
  };

  return (
    <div className="App">
      <h1>Share Your Files Here</h1>
      <div>Count : {userCount}</div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendMessage} disabled={!file}>
        Send File
      </button>

      {uploadProgress > 0 && (
        <div>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}

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
