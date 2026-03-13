import { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const API_URL = '/api';

export default function AnalyzePage() {
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/analyze`, { sessionId });
      setResult(response.data);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.response?.data?.error || 'Analysis failed. Please check the session ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Session Analysis</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
          <label className="block text-slate-300 mb-3 font-semibold text-lg">
            Enter Session ID or Log ID
          </label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full bg-slate-950 text-white rounded-lg p-4 border-2 border-slate-800 focus:border-blue-500 focus:outline-none transition-colors font-mono"
            placeholder="session-1, demo-1, etc."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !sessionId.trim()}
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Session
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 mb-8 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-semibold mb-1">Analysis Failed</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Risk Overview */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Risk Assessment</h2>
              <RiskBadge level={result.riskLevel} />
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              {result.explanation}
            </p>
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
              <div className="text-slate-400 text-sm font-medium mb-2">Average Risk Score</div>
              <div className="text-3xl font-bold text-white">{result.avgRiskScore}</div>
            </div>
          </div>

          {/* Suspicious Patterns */}
          {result.suspiciousPatterns && result.suspiciousPatterns.length > 0 && (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Suspicious Patterns Detected</h3>
              <ul className="space-y-2">
                {result.suspiciousPatterns.map((pattern: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <span className="text-yellow-400 mt-1">⚠</span>
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Recommendation</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
              {result.recommendation}
            </p>
          </div>

          {/* Risk Distribution */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/5 border-2 border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-green-400 text-sm font-semibold mb-2">LOW</div>
                <div className="text-3xl font-bold text-white">{result.riskDistribution?.LOW || 0}</div>
              </div>
              <div className="bg-yellow-500/5 border-2 border-yellow-500/30 rounded-xl p-4 text-center">
                <div className="text-yellow-400 text-sm font-semibold mb-2">MEDIUM</div>
                <div className="text-3xl font-bold text-white">{result.riskDistribution?.MEDIUM || 0}</div>
              </div>
              <div className="bg-red-500/5 border-2 border-red-500/30 rounded-xl p-4 text-center">
                <div className="text-red-400 text-sm font-semibold mb-2">HIGH</div>
                <div className="text-3xl font-bold text-white">{result.riskDistribution?.HIGH || 0}</div>
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Entries Analyzed:</span>
                <span className="text-white font-semibold">{result.entriesAnalyzed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Risk Score:</span>
                <span className="text-white font-semibold">{result.avgRiskScore}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
