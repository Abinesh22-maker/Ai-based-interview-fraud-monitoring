import React, { useState } from 'react';
import { Role } from '../types';
import { Button } from '../components/Button';
import { ShieldCheck, User, Video } from 'lucide-react';

interface LobbyProps {
  onJoin: (role: Role, apiKey: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.CANDIDATE);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(selectedRole, apiKey);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600/20 p-4 rounded-full">
            <ShieldCheck size={48} className="text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">Sentinel AI</h1>
        <p className="text-slate-400 text-center mb-8">Secure Interview & Analysis Platform</p>

        <form onSubmit={handleJoin} className="space-y-6">
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Select Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole(Role.CANDIDATE)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === Role.CANDIDATE ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <User size={24} />
                <span className="font-medium">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole(Role.INTERVIEWER)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === Role.INTERVIEWER ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <Video size={24} />
                <span className="font-medium">Interviewer</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Gemini API Key (Optional)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter key for grammar analysis..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-slate-500">Leave empty to use mock analysis data.</p>
          </div>

          <Button type="submit" fullWidth className="h-12 text-lg">
            Enter Interview Room
          </Button>
        </form>
      </div>
    </div>
  );
};