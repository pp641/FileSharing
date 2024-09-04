import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileSharing from './FileSharing';
import TextMessage from './TextMessage';
import SpeechRecognitionComponent from './SpeechRecognitionComponent';
import Whiteboard from './WhiteBoard';
import VideoChat from './VideoChat';

const Home = () => {
  return (
    <div>
      <div><Link to="/file-sharing">File Sharing</Link></div>
      <div><Link to="/text-message">Text Sharing</Link></div>
      <div><Link to="/speech-recognition">Speech Recognition</Link></div>
      <div><Link to="/whiteboard-canvas">Whiteboard Canvas</Link></div>
      <div><Link to="/video-chat">Video Chatting</Link></div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-sharing" element={<FileSharing />} />
          <Route path="/text-message" element={<TextMessage />} />
          <Route path="/whiteboard-canvas" element={<Whiteboard />} />
          <Route path="/video-chat" element={<VideoChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
