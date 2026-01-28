import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Role, Violation, ViolationType } from '../types';
import { MAX_WARNINGS, VIOLATION_MESSAGES } from '../constants';
import { WarningToast } from '../components/WarningToast';
import { Button } from '../components/Button';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Settings, AlertOctagon } from 'lucide-react';

interface InterviewRoomProps {
  role: Role;
  onEndInterview: () => void;
  addViolation: (v: Violation) => void;
  violations: Violation[];
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ role, onEndInterview, addViolation, violations }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [detectionActive, setDetectionActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Real detection: Visibility Change (Tab Switching)
  useEffect(() => {
    if (role !== Role.CANDIDATE) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerViolation(ViolationType.TAB_SWITCH);
      }
    };

    const handleBlur = () => {
       triggerViolation(ViolationType.WINDOW_BLUR);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Simulating AI Detection backend connection
  useEffect(() => {
    if (role !== Role.CANDIDATE || !detectionActive) return;

    // In a real app, this would be a WebSocket listener from the Python backend
    // For this demo, we simulate occasional "Gaze" or "Phone" detections if enabled
    const interval = setInterval(() => {
      // 1% chance every second to detect a random movement for demo purposes
      // This allows the reviewer to see the UI in action without needing physically setup
      // specific conditions (though Tab Switch is real above).
      if (Math.random() < 0.02) {
         const types = [ViolationType.GAZE_AVERSION, ViolationType.PHONE_DETECTED];
         const randomType = types[Math.floor(Math.random() * types.length)];
         // Uncomment to enable auto-simulation:
         // triggerViolation(randomType); 
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, detectionActive]);

  // Setup Camera
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    if (camOn) startVideo();
    else if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
    }
  }, [camOn]);

  const triggerViolation = useCallback((type: ViolationType) => {
    addViolation({
      id: Date.now().toString(),
      type,
      timestamp: Date.now(),
      message: VIOLATION_MESSAGES[type]
    });
  }, [addViolation]);

  // Force end if max warnings reached
  useEffect(() => {
    if (violations.length >= MAX_WARNINGS) {
      const timer = setTimeout(() => {
        onEndInterview();
      }, 3000); // Give them 3 seconds to see the "TERMINATED" toast
      return () => clearTimeout(timer);
    }
  }, [violations, onEndInterview]);

  const lastViolation = violations.length > 0 ? violations[violations.length - 1] : null;

  return (
    <div className="relative h-screen w-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Warning Overlay */}
      <WarningToast violation={lastViolation} count={violations.length} max={MAX_WARNINGS} />

      {/* Main Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-80px)]">
        
        {/* Local User (Self) */}
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
            You ({role})
          </div>
          {camOn ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover transform ${role === Role.CANDIDATE ? 'scale-x-[-1]' : ''}`} // Mirror if candidate
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                  <VideoOff size={32} />
                </div>
                <p>Camera Off</p>
              </div>
            </div>
          )}

          {/* AI Overlay Visualizer (Mock) */}
          {role === Role.CANDIDATE && detectionActive && camOn && (
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-blue-500/30 rounded-full animate-pulse opacity-50"></div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs text-green-400 bg-black/60 px-2 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Face Detected
                    </span>
                    <span className="flex items-center gap-2 text-xs text-green-400 bg-black/60 px-2 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Eye Tracking Active
                    </span>
                </div>
            </div>
          )}
        </div>

        {/* Remote User (Simulated) */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
           <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
            {role === Role.CANDIDATE ? 'Interviewer' : 'Candidate'}
          </div>
          <img 
            src="https://picsum.photos/800/600" 
            alt="Remote User" 
            className="w-full h-full object-cover opacity-80"
          />
           <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-300">
              Connection: Stable (24ms)
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
           <div className="text-left">
              <h3 className="text-white font-semibold">Technical Interview: Senior Engineer</h3>
              <p className="text-xs text-slate-400">00:12:45 elapsed</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            className={`rounded-full p-4 ${!micOn && 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            onClick={() => setMicOn(!micOn)}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>
          <Button 
            variant="secondary" 
            className={`rounded-full p-4 ${!camOn && 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            onClick={() => setCamOn(!camOn)}
          >
            {camOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
          </Button>
          
          {/* Debug/Demo Controls - visible to show off functionality */}
          <div className="h-8 w-px bg-slate-700 mx-2"></div>
          
          <div className="relative group">
            <Button variant="ghost" className="rounded-full p-4" onClick={() => setDetectionActive(!detectionActive)}>
               <Settings size={20} className={detectionActive ? "text-blue-400" : "text-slate-500"} />
            </Button>
            {/* Simulation Menu for Demo */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-xl hidden group-hover:block">
                <p className="text-xs text-slate-400 mb-2 px-2 uppercase font-bold">Simulate Alert</p>
                <button onClick={() => triggerViolation(ViolationType.PHONE_DETECTED)} className="w-full text-left text-xs text-red-400 hover:bg-slate-700 p-2 rounded">Simulate Phone</button>
                <button onClick={() => triggerViolation(ViolationType.GAZE_AVERSION)} className="w-full text-left text-xs text-orange-400 hover:bg-slate-700 p-2 rounded">Simulate Gaze</button>
            </div>
          </div>
        </div>

        <div>
          <Button variant="danger" onClick={onEndInterview} className="flex items-center gap-2">
            <PhoneOff size={20} />
            <span>End Interview</span>
          </Button>
        </div>
      </div>
      
      {/* Violations Counter (For Interviewer View) */}
      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-lg w-64">
         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Session Health</h4>
         <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Violations</span>
            <span className={`font-mono font-bold ${violations.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {violations.length}/{MAX_WARNINGS}
            </span>
         </div>
         <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
             <div 
                className={`h-full transition-all duration-500 ${violations.length >= 2 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(violations.length / MAX_WARNINGS) * 100}%` }}
             ></div>
         </div>
         {violations.length > 0 && (
             <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                 {violations.slice().reverse().map((v) => (
                     <div key={v.id} className="flex items-start gap-2 text-xs text-red-300 bg-red-900/20 p-2 rounded">
                         <AlertOctagon size={12} className="mt-0.5 shrink-0" />
                         <span>{v.message}</span>
                         <span className="text-slate-500 ml-auto">{new Date(v.timestamp).toLocaleTimeString([], {minute: '2-digit', second:'2-digit'})}</span>
                     </div>
                 ))}
             </div>
         )}
      </div>

    </div>
  );
};