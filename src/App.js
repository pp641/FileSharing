import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import FileSharing from './FileSharing';
import TextMessage from './TextMessage';
import SpeechRecognitionComponent from './SpeechRecognitionComponent';
import Whiteboard from './WhiteBoard';
import VideoChat from './VideoChat';

const defaultId = Math.random().toString(36).substr(2, 9);

const Home = () => {
  const [fileSharingId, setFileSharingId] = useState('');
  const [textMessageId, setTextMessageId] = useState('');
  const [speechRecognitionId, setSpeechRecognitionId] = useState('');
  const [whiteboardId, setWhiteboardId] = useState('');
  const [videoChatId, setVideoChatId] = useState('');

  const [isFileSharingEnabled, setIsFileSharingEnabled] = useState(false);
  const [isTextMessageEnabled, setIsTextMessageEnabled] = useState(false);
  const [isSpeechRecognitionEnabled, setIsSpeechRecognitionEnabled] = useState(false);
  const [isWhiteboardEnabled, setIsWhiteboardEnabled] = useState(false);
  const [isVideoChatEnabled, setIsVideoChatEnabled] = useState(false);

  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleInputChange = (e, setter, enableSetter) => {
    const inputValue = e.target.value;
    setter(inputValue);
    enableSetter(inputValue.length >= 6); // Assuming 6 is the minimum length for enabling the button
  };

  const handleButtonClick = (path, id) => {
    const finalId = id.length >= 6 ? id : defaultId;
    navigate(`${path}/${finalId}`);
  };

  return (
    <div className="flex flex-col items-center py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Socket Apps for Fun</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* File Sharing */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">File Sharing</h2>
          <input
            type="text"
            value={fileSharingId}
            onChange={(e) => handleInputChange(e, setFileSharingId, setIsFileSharingEnabled)}
            placeholder="Enter ID for File Sharing"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={() => handleButtonClick('/file-sharing', fileSharingId)}
            disabled={!isFileSharingEnabled}
            className={`w-full py-2 rounded-lg ${isFileSharingEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Open File Sharing
          </button>
        </div>

        {/* Text Sharing */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Text Sharing</h2>
          <input
            type="text"
            value={textMessageId}
            onChange={(e) => handleInputChange(e, setTextMessageId, setIsTextMessageEnabled)}
            placeholder="Enter ID for Text Message"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={() => handleButtonClick('/text-message', textMessageId)}
            disabled={!isTextMessageEnabled}
            className={`w-full py-2 rounded-lg ${isTextMessageEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Open Text Sharing
          </button>
        </div>

        {/* Speech Recognition */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Speech Recognition</h2>
          <input
            type="text"
            value={speechRecognitionId}
            onChange={(e) => handleInputChange(e, setSpeechRecognitionId, setIsSpeechRecognitionEnabled)}
            placeholder="Enter ID for Speech Recognition"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={() => handleButtonClick('/speech-recognition', speechRecognitionId)}
            disabled={!isSpeechRecognitionEnabled}
            className={`w-full py-2 rounded-lg ${isSpeechRecognitionEnabled ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Open Speech Recognition
          </button>
        </div>

        {/* Whiteboard */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Whiteboard Canvas</h2>
          <input
            type="text"
            value={whiteboardId}
            onChange={(e) => handleInputChange(e, setWhiteboardId, setIsWhiteboardEnabled)}
            placeholder="Enter ID for Whiteboard"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={() => handleButtonClick('/whiteboard-canvas', whiteboardId)}
            disabled={!isWhiteboardEnabled}
            className={`w-full py-2 rounded-lg ${isWhiteboardEnabled ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Open Whiteboard
          </button>
        </div>

        {/* Video Chat */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Video Chatting</h2>
          <input
            type="text"
            value={videoChatId}
            onChange={(e) => handleInputChange(e, setVideoChatId, setIsVideoChatEnabled)}
            placeholder="Enter ID for Video Chat"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={() => handleButtonClick('/video-chat', videoChatId)}
            disabled={!isVideoChatEnabled}
            className={`w-full py-2 rounded-lg ${isVideoChatEnabled ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Open Video Chat
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-sharing/:id" element={<FileSharing />} />
          <Route path="/text-message/:id" element={<TextMessage />} />
          <Route path="/speech-recognition/:id" element={<SpeechRecognitionComponent />} />
          <Route path="/whiteboard-canvas/:id" element={<Whiteboard />} />
          <Route path="/video-chat/:id" element={<VideoChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
