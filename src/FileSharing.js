import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const FileSharing = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [userList, setUserList] = useState([]); // State to hold the list of connected users
  const [downloadable, setDownloadable] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000/', {
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    // When the client connects, join the room
    socketInstance.on('connect', () => {
      console.log('Connected to server');
      socketInstance.emit('joinRoom', id); 
    });

    // Listen for the user list update and set it in state
    socketInstance.on('userListUpdate', (users) => {
      setUserList(users);
      setUserCount(users.length); // Update the user count based on the list length
    });

    socketInstance.on('receiveMessage', (message) => {
      const { fileName, fileData, senderId, roomId } = message;
      if (senderId !== socketInstance.id && roomId === id) {
        const blob = new Blob([fileData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        setDownloadable({ url, fileName });
      }
    });

    return () => {
      socketInstance.disconnect(); // Cleanup the socket connection
    };
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0); 
  };

  const sendMessage = () => {
    if (socket && file) {
      const reader = new FileReader();

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="text-2xl font-bold mb-4">Share Your Files Here</div>
      <div className="text-lg mb-4">Connected Users: {userCount}</div>
      <div className="text-lg mb-4">User List:</div>
      <ul className="list-disc mb-4">
        {userList.map(user => (
          <li key={user.id}>{user.id}</li>
        ))}
      </ul>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="mb-4 p-2 border border-gray-300 rounded" 
      />
      <button
        onClick={sendMessage}
        disabled={!file}
        className={`p-2 text-white rounded ${file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Send File
      </button>

      {uploadProgress > 0 && (
        <div className="mt-4 w-full max-w-xs">
          <progress value={uploadProgress} max="100" className="w-full"></progress>
          <div className="text-sm text-gray-600 mt-2">{uploadProgress}%</div>
        </div>
      )}

      {downloadable && (
        <div className="mt-4">
          <a href={downloadable.url} download={downloadable.fileName}>
            <button className="p-2 bg-green-600 text-white rounded hover:bg-green-700">
              Download {downloadable.fileName}
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default FileSharing;
