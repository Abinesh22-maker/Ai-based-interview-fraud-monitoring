import React, { useEffect, useState } from 'react';
import { Violation, GrammarAnalysisResult } from '../types';
import { analyzeGrammar } from '../services/geminiService';
import { DEMO_TRANSCRIPT } from '../constants';
import { Button } from '../components/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertOctagon, CheckCircle, Brain, MessageSquare, AlertTriangle, Download, RefreshCw } from 'lucide-react';

interface DashboardProps {
  violations: Violation[];
  apiKey: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ violations, apiKey, onReset }) => {
  const [analysis, setAnalysis] = useState<GrammarAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      // In a real app, we would pass the actual recorded transcript.
      // Here we use the demo constant.
      const result = await analyzeGrammar(DEMO_TRANSCRIPT, apiKey);
      setAnalysis(result);
      setLoading(false);
    };

    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Analyzing Session Data...</h2>
        <p className="text-slate-400">Processing audio transcript via Gemini AI & Compiling Fraud Reports</p>
      </div>
    );
  }

  const chartData = analysis ? [
    { subject: 'Grammar', A: analysis.score, fullMark: 100 },
    { subject: 'Fluency', A: analysis.fluency, fullMark: 100 },
    { subject: 'Clarity', A: analysis.clarity, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Interview Report</h1>
            <p className="text-slate-400">Candidate ID: CAND-8821 • Session Duration: 24m 12s</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" className="flex items-center gap-2">
                <Download size={18} /> Export PDF
             </Button>
             <Button onClick={onReset} className="flex items-center gap-2">
                <RefreshCw size={18} /> New Session
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Main Score Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Brain size={16} /> AI Grammar Assessment
            </h3>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                  <circle cx="80" cy="80" r="70" stroke={analysis && analysis.score > 70 ? "#3b82f6" : "#ef4444"} strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (analysis?.score || 0)) / 100} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className={`text-5xl font-bold ${getScoreColor(analysis?.score || 0)}`}>{analysis?.score}</span>
                  <span className="block text-slate-500 text-sm font-medium mt-1">/100</span>
                </div>
              </div>
              <p className="mt-4 text-center text-slate-300 italic px-4">"{analysis?.feedback}"</p>
            </div>
          </div>

          {/* Metrics Charts */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg lg:col-span-1">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Metric Breakdown</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Candidate" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Grammar Issues List */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg lg:col-span-1 overflow-y-auto max-h-[400px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> Key Issues Found
            </h3>
            <div className="space-y-3">
              {analysis?.grammarIssues.map((issue, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg text-sm text-slate-300 flex gap-3">
                  <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
              {analysis?.grammarIssues.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                    <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                    No major issues detected.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fraud Logs */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <AlertOctagon size={16} /> Fraud & Misconduct Log
           </h3>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Violation Type</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Severity</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {violations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-slate-300 font-mono text-sm">
                        {new Date(v.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          {v.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">High</td>
                      <td className="py-3 px-4 text-slate-300 text-sm">{v.message}</td>
                    </tr>
                  ))}
                  {violations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No misconduct detected during this session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
};