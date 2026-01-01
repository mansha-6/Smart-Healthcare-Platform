import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from '../context/AuthContext';
// Polyfill for simple-peer in Vite
import * as process from "process";
window.global = window;
window.process = process;
window.Buffer = window.Buffer || [];

const Teleconsult = () => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [idToCall, setIdToCall] = useState('');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true); // New State
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socket = useRef();

  const { user } = useAuth();
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  // Function to start the media stream with retry logic
  const startStream = async (videoPreference) => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: videoPreference, audio: true });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
      setVideoEnabled(videoPreference); // Update state based on what was successfully obtained
    } catch (err) {
      console.error("Camera Access Error:", err);
      if (videoPreference) {
        alert("Camera busy! Switching to Audio Only mode automatically.");
        // Retry with Audio Only
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          setStream(audioStream);
          setVideoEnabled(false); // Set video to false as only audio was obtained
          // No video src for local audio, or maybe a placeholder?
        } catch (audioErr) {
          console.error("Audio Access Error:", audioErr);
          alert(`Even Audio failed: ${audioErr.name}. Check permissions.`);
        }
      } else {
        alert(`Audio Error: ${err.name}. Check permissions.`);
      }
    }
  };

  useEffect(() => {
    socket.current = io(BASE_URL);
    
    startStream(videoEnabled); // Call the new function to start the stream

    socket.current.on('me', (id) => setMe(id));

    socket.current.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
    
    setName(user?.name || 'User');
    
    return () => {
        socket.current.disconnect();
        // Stop stream tracks
        if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ 
      initiator: false, 
      trickle: false, 
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('signal', (data) => {
      socket.current.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log('Got Remote Stream (Answer):', currentStream);
      setRemoteVideoEnabled(currentStream.getVideoTracks().length > 0); // Check tracks
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.on('error', (err) => console.error('Peer connection error (Answer):', err));

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ 
      initiator: true, 
      trickle: false, 
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      } 
    });

    peer.on('signal', (data) => {
      socket.current.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      console.log('Got Remote Stream (Caller):', currentStream);
      setRemoteVideoEnabled(currentStream.getVideoTracks().length > 0); // Check tracks
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.on('error', (err) => console.error('Peer connection error (Caller):', err));

    socket.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-8">
      <h1 className="text-3xl font-bold">Teleconsultation Room</h1>
      
      {/* Settings */}
      {!callAccepted && (
        <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={videoEnabled} 
                    onChange={() => {
                        setVideoEnabled(!videoEnabled);
                        window.location.reload(); 
                    }} 
                />
                <span>Enable Video (Uncheck if camera busy)</span>
            </label>
        </div>
      )}

      {/* Video Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* My Video */}
        <div className="relative">
            {stream && <video playsInline muted ref={myVideo} autoPlay className="w-full rounded-lg shadow-lg bg-gray-900" />}
            <p className="text-center mt-2 font-semibold">Me ({name})</p>
        </div>
        
        {/* User Video */}
        <div className="relative">
            {callAccepted && !callEnded ? (
                remoteVideoEnabled ? (
                    <video playsInline ref={userVideo} autoPlay className="w-full rounded-lg shadow-lg bg-gray-900" />
                ) : (
                     <div className="w-full h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-white">
                        <div className="text-4xl mb-2">🎤</div>
                        <p className="font-semibold">User is Audio Only</p>
                     </div>
                )
            ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Waiting for connection...</p>
                </div>
            )}
             <p className="text-center mt-2 font-semibold">{callAccepted && !callEnded ? (call.name || 'Doctor') : 'Remote User'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
         <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">My ID (Share this with doctor):</p>
            <div className="flex items-center space-x-2">
                <input readOnly value={me} className="border p-2 rounded w-full bg-gray-50" />
                <button onClick={() => navigator.clipboard.writeText(me)} className="bg-gray-200 px-3 py-2 rounded">Copy</button>
            </div>
         </div>

         <div className="mb-4">
             <input 
                placeholder="ID to Call" 
                value={idToCall} 
                onChange={(e) => setIdToCall(e.target.value)}
                className="border p-2 rounded w-full mb-2"
             />
             {callAccepted && !callEnded ? (
                 <button onClick={leaveCall} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">End Call</button>
             ) : (
                 <button onClick={() => callUser(idToCall)} className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600">Call</button>
             )}
         </div>

         {call.isReceivingCall && !callAccepted && (
             <div className="flex flex-col items-center p-4 bg-yellow-50 rounded border border-yellow-200">
                 <p className="font-bold mb-2">{call.name} is calling...</p>
                 <button onClick={answerCall} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 animate-pulse">Answer</button>
             </div>
         )}
      </div>
    </div>
  );
};

export default Teleconsult;
