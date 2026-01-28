import React, { useState } from 'react';
import { Role, Violation } from './types';
import { Lobby } from './views/Lobby';
import { InterviewRoom } from './views/InterviewRoom';
import { Dashboard } from './views/Dashboard';

enum View {
  LOBBY,
  INTERVIEW,
  DASHBOARD
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LOBBY);
  const [role, setRole] = useState<Role>(Role.CANDIDATE);
  const [apiKey, setApiKey] = useState<string>('');
  const [violations, setViolations] = useState<Violation[]>([]);

  const handleJoin = (selectedRole: Role, key: string) => {
    setRole(selectedRole);
    setApiKey(key);
    setView(View.INTERVIEW);
    setViolations([]);
  };

  const handleEndInterview = () => {
    setView(View.DASHBOARD);
  };

  const handleAddViolation = (v: Violation) => {
    setViolations(prev => [...prev, v]);
  };

  const handleReset = () => {
    setView(View.LOBBY);
    setViolations([]);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      {view === View.LOBBY && (
        <Lobby onJoin={handleJoin} />
      )}
      
      {view === View.INTERVIEW && (
        <InterviewRoom 
          role={role} 
          onEndInterview={handleEndInterview} 
          addViolation={handleAddViolation}
          violations={violations}
        />
      )}

      {view === View.DASHBOARD && (
        <Dashboard 
          violations={violations}
          apiKey={apiKey}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;