import { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, AlertCircle, Shield, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { DEMO_MODE, generateForensicAnalysis, type ForensicAnalysis } from '../demo/demoEngine';

const API_URL = '/api';

export default function AnalyzePage() {
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForensicAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const analysis = generateForensicAnalysis(sessionId);
        setResult(analysis);
      } else {
        const response = await axios.post(`${API_URL}/analyze`, { sessionId });
        setResult(response.data);
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.response?.data?.error || 'Analysis failed. Please check the session ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {DEMO_MODE && (
        <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">DEMO SIMULATION MODE</span>
            <span className="text-slate-400">— Synthetic Forensic Analysis</span>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-white mb-8">Forensic Session Analysis</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
          <label className="block text-slate-300 mb-3 font-semibold text-lg">
            Enter Session ID or Incident ID
          </label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full bg-slate-950 text-white rounded-lg p-4 border-2 border-slate-800 focus:border-blue-500 focus:outline-none transition-colors font-mono"
            placeholder={DEMO_MODE ? "Enter any text to analyze..." : "session-1, demo-1, etc."}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !sessionId.trim()}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Forensic Analysis...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Analyze Incident
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <div className="text-red-400 font-semibold mb-1">Analysis Failed</div>
              <div className="text-slate-300">{error}</div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Incident Header */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-slate-400 text-sm mb-1">Incident ID</div>
                <div className="text-2xl font-bold text-white font-mono">{result.incident_id}</div>
              </div>
              <div className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getRiskColor(result.risk_level)}`}>
                {result.risk_level}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-slate-400 text-sm mb-1">Agent ID</div>
                <div className="text-white font-mono">{result.agent_id}</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Timestamp</div>
                <div className="text-white">{new Date(result.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className={`rounded-xl p-6 border-2 ${result.anomaly_detected ? 'bg-red-500/5 border-red-500/30' : 'bg-green-500/5 border-green-500/30'}`}>
            <div className="flex items-center gap-3 mb-3">
              {result.anomaly_detected ? (
                <AlertTriangle className="w-6 h-6 text-red-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
              <div className={`text-xl font-bold ${result.anomaly_detected ? 'text-red-400' : 'text-green-400'}`}>
                {result.anomaly_detected ? 'Anomaly Detected' : 'No Anomaly Detected'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 text-sm mb-1">Policy Violation Probability</div>
                <div className="text-white text-2xl font-bold">{result.policy_violation_probability}</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Financial Exposure Risk</div>
                <div className="text-white text-2xl font-bold">{result.financial_exposure_risk}</div>
              </div>
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <div className="text-cyan-400 font-semibold mb-3 text-lg">Root Cause Analysis</div>
            <div className="text-white text-lg leading-relaxed">{result.root_cause}</div>
          </div>

          {/* Safety Status */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <div className="text-green-400 font-semibold mb-3 text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Safety Status
            </div>
            <div className="text-white text-lg leading-relaxed">{result.safety_status}</div>
          </div>

          {/* Forensic Trace */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <div className="text-purple-400 font-semibold mb-3 text-lg">Forensic Trace Reconstruction</div>
            <div className="text-white text-lg leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-700 font-mono">
              {result.forensic_trace}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-6">
            <div className="text-blue-400 font-semibold mb-3 text-lg">Recommended Actions</div>
            <ul className="text-white space-y-2">
              {result.anomaly_detected ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Review agent decision logs for policy compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Verify safety override mechanisms are functioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Conduct full forensic audit of decision chain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Update policy boundaries if necessary</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>No immediate action required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Continue standard monitoring protocols</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
