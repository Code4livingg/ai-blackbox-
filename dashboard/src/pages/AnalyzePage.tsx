import { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import HashDisplay from '../components/HashDisplay';

const API_URL = 'http://localhost:3001';

export default function AnalyzePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { prompt });
      setResult(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">AI Analysis</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
          <label className="block text-slate-300 mb-3 font-semibold text-lg">
            Enter your prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-950 text-white rounded-lg p-4 border-2 border-slate-800 focus:border-blue-500 focus:outline-none min-h-[120px] resize-y transition-colors"
            placeholder="Ask anything..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
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
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-6">
          {/* Cross-Model Comparison */}
          {result.models && result.models.length > 0 ? (
            <>
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Cross-Model Analysis</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Comparing responses from {result.models.length} different AI models
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.models.map((model: any, index: number) => (
                    <div key={index} className="bg-slate-950 rounded-lg p-5 border-2 border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{model.modelName}</h3>
                        <RiskBadge level={model.riskLevel} />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Response</span>
                          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                            {model.response.substring(0, 300)}
                            {model.response.length > 300 && '...'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Risk Assessment</span>
                          <p className="text-slate-400 text-xs mt-2 bg-slate-900 p-2 rounded border border-slate-800">
                            {model.riskReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Comparison Summary */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Comparison</h3>
                <div className="grid grid-cols-3 gap-4">
                  {result.models.map((model: any, index: number) => (
                    <div key={index} className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-center">
                      <div className="text-slate-400 text-xs mb-2 font-medium">{model.modelName}</div>
                      <RiskBadge level={model.riskLevel} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Legacy single-model format */
            <>
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">AI Response</h2>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.response}
                </p>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-sm font-medium">Risk Level:</span>
                    <div className="mt-2">
                      <RiskBadge level={result.riskLevel} />
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm font-medium">Reason:</span>
                    <p className="text-slate-300 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800">{result.riskReason}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Audit Trail */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Audit Trail</h3>
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 text-sm font-medium block mb-2">Session ID:</span>
                <code className="bg-slate-950 px-3 py-2 rounded-lg text-sm text-blue-400 font-mono block border border-slate-800">
                  {result.sessionId}
                </code>
              </div>
              <div>
                <span className="text-slate-400 text-sm font-medium block mb-2">Audit Entry ID:</span>
                <code className="bg-slate-950 px-3 py-2 rounded-lg text-sm text-blue-400 font-mono block border border-slate-800">
                  {result.auditEntryId}
                </code>
              </div>
              <div>
                <HashDisplay
                  hash={result.hash}
                  label="Entry Hash"
                  truncate={false}
                />
              </div>
              <div>
                <HashDisplay
                  hash={result.previousHash}
                  label="Previous Hash"
                  truncate={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
