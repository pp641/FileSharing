import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './Styles/main_page.css';
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
    <React.Fragment>
      <div className='dashboard-upper'>Some Socket Apps for Fun</div>
      <div className='dashboard-outer'>
        <div className='dashboard-inner'>
          <Link to={`/file-sharing/${defaultId}`}>File Sharing</Link>
          <input 
            type='text' 
            value={fileSharingId} 
            onChange={(e) => handleInputChange(e, setFileSharingId, setIsFileSharingEnabled)} 
            placeholder='Enter ID for File Sharing'
          />
          <button 
            onClick={() => handleButtonClick('/file-sharing', fileSharingId)} 
            disabled={!isFileSharingEnabled} 
            className={isFileSharingEnabled ? 'enabled-button' : 'disabled-button'}
          >
            Open File Sharing
          </button>
        </div>
        <div className='dashboard-inner'>
          <Link to={`/text-message/${defaultId}`}>Text Sharing</Link>
          <input 
            type='text' 
            value={textMessageId} 
            onChange={(e) => handleInputChange(e, setTextMessageId, setIsTextMessageEnabled)} 
            placeholder='Enter ID for Text Message'
          />
          <button 
            onClick={() => handleButtonClick('/text-message', textMessageId)} 
            disabled={!isTextMessageEnabled} 
            className={isTextMessageEnabled ? 'enabled-button' : 'disabled-button'}
          >
            Open Text Message
          </button>
        </div>
        <div className='dashboard-inner'>
          <Link to={`/speech-recognition/${defaultId}`}>Speech Recognition</Link>
          <input 
            type='text' 
            value={speechRecognitionId} 
            onChange={(e) => handleInputChange(e, setSpeechRecognitionId, setIsSpeechRecognitionEnabled)} 
            placeholder='Enter ID for Speech Recognition'
          />
          <button 
            onClick={() => handleButtonClick('/speech-recognition', speechRecognitionId)} 
            disabled={!isSpeechRecognitionEnabled} 
            className={isSpeechRecognitionEnabled ? 'enabled-button' : 'disabled-button'}
          >
            Open Speech Recognition
          </button>
        </div>
        <div className='dashboard-inner'>
          <Link to={`/whiteboard-canvas/${defaultId}`}>Whiteboard Canvas</Link>
          <input 
            type='text' 
            value={whiteboardId} 
            onChange={(e) => handleInputChange(e, setWhiteboardId, setIsWhiteboardEnabled)} 
            placeholder='Enter ID for Whiteboard'
          />
          <button 
            onClick={() => handleButtonClick('/whiteboard-canvas', whiteboardId)} 
            disabled={!isWhiteboardEnabled} 
            className={isWhiteboardEnabled ? 'enabled-button' : 'disabled-button'}
          >
            Open Whiteboard
          </button>
        </div>
        <div className='dashboard-inner'>
          <Link to={`/video-chat/${defaultId}`}>Video Chatting</Link>
          <input 
            type='text' 
            value={videoChatId} 
            onChange={(e) => handleInputChange(e, setVideoChatId, setIsVideoChatEnabled)} 
            placeholder='Enter ID for Video Chat'
          />
          <button 
            onClick={() => handleButtonClick('/video-chat', videoChatId)} 
            disabled={!isVideoChatEnabled} 
            className={isVideoChatEnabled ? 'enabled-button' : 'disabled-button'}
          >
            Open Video Chat
          </button>
        </div>
      </div>
    </React.Fragment>
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
