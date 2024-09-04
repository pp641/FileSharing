import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoChat = () => {
  const [socket, setSocket] = useState(null);
  const [isMuted, setIsMuted] = useState(false); // State for mute status
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnectionConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  let localStream;
  let peerConnection;

  useEffect(() => {
    const socketInstance = io('http://192.168.1.7:5000',{
        transports : ['websockets', 'polling']
    });
    setSocket(socketInstance);

    socketInstance.on('signal', async (data) => {
      try {
        if (data.type === 'ice') {
          await peerConnection.addIceCandidate(data.candidate);
        } else if (data.type === 'offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socketInstance.emit('signal', { type: 'answer', answer });
        } else if (data.type === 'answer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } catch (error) {
        console.error('Error handling signal data:', error);
      }
    });

    startVideoChat();

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const startVideoChat = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      peerConnection = new RTCPeerConnection(peerConnectionConfig);
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('signal', { type: 'ice', candidate: event.candidate });
        }
      };

      // Create an offer to start the connection
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      if (socket) {
        socket.emit('signal', { type: 'offer', offer });
      }
    } catch (error) {
      console.error('Error accessing media devices or setting up peer connection.', error);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsMuted(!videoTracks[0].enabled);
      } else {
        console.error('No video tracks found.');
      }
    } else {
      console.error('Local stream is not initialized.');
    }
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <video ref={localVideoRef} autoPlay muted style={{ width: '45%' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '45%' }} />
      <button onClick={toggleMute}>
        {isMuted ? 'Unmute Video' : 'Mute Video'}
      </button>
    </div>
  );
};

export default VideoChat;
