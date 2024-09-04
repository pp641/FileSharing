import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './main_page.css';
import FileSharing from './FileSharing';
import TextMessage from './TextMessage';
import SpeechRecognitionComponent from './SpeechRecognitionComponent';
import Whiteboard from './WhiteBoard';
import VideoChat from './VideoChat';

const Home = () => {
  return (
    <React.Fragment>
      <div className='dashboard-upper'>Some Socket Apps for Fun</div>
      <div className='dashboard-outer'>
        <div className='dashboard-inner'><Link to={`/file-sharing/${Math.random().toString(36).substr(2, 9)}`}>File Sharing</Link></div>
        <div className='dashboard-inner'><Link to="/text-message">Text Sharing</Link></div>
        <div className='dashboard-inner'><Link to="/speech-recognition">Speech Recognition</Link></div>
        <div className='dashboard-inner'><Link to="/whiteboard-canvas">Whiteboard Canvas</Link></div>
        <div className='dashboard-inner'><Link to="/video-chat">Video Chatting</Link></div>
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
          <Route path="/text-message" element={<TextMessage />} />
          <Route path="/whiteboard-canvas" element={<Whiteboard />} />
          <Route path="/speech-recognition" element={<SpeechRecognitionComponent />} />
          <Route path="/video-chat" element={<VideoChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
