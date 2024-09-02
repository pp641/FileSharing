import logo from './logo.svg';
import './App.css';
import FileSharing from './fileSharing';
import TextMessage from './TextMessage';
import SpeechRecognitionComponent from './speechToText';

function App() {
  return (
    <div className="App">
      <FileSharing/>
      <TextMessage/>
      <SpeechRecognitionComponent/>
    </div>
  );
}

export default App;
