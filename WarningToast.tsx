import React, { useEffect, useState } from 'react';
import { Violation } from '../types';
import { AlertTriangle, XCircle } from 'lucide-react';

interface WarningToastProps {
  violation: Violation | null;
  count: number;
  max: number;
}

export const WarningToast: React.FC<WarningToastProps> = ({ violation, count, max }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (violation) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [violation]);

  if (!visible || !violation) return null;

  const isCritical = count >= max;

  return (
    <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 p-4 rounded-xl shadow-2xl border ${isCritical ? 'bg-red-900/90 border-red-500 text-white' : 'bg-orange-900/90 border-orange-500 text-orange-50'} backdrop-blur-md animate-bounce`}>
      <div className={`p-2 rounded-full ${isCritical ? 'bg-red-800' : 'bg-orange-800'}`}>
        {isCritical ? <XCircle size={24} /> : <AlertTriangle size={24} />}
      </div>
      <div>
        <h4 className="font-bold text-lg">{isCritical ? 'INTERVIEW TERMINATED' : 'MISCONDUCT DETECTED'}</h4>
        <p className="text-sm opacity-90">{violation.message}</p>
        <p className="text-xs mt-1 font-mono uppercase tracking-wider">
          Warning {count} of {max}
        </p>
      </div>
    </div>
  );
};