import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const API_URL = '/api';

export default function IntegrityPage() {
  const [integrity, setIntegrity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchIntegrity();
  }, []);

  const fetchIntegrity = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/integrity`);
      setIntegrity(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch integrity:', error);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Verifying chain integrity...</div>
      </div>
    );
  }

  const validSessions = integrity?.sessions?.filter((s: any) => s.valid).length || 0;
  const totalSessions = integrity?.sessions?.length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Chain Integrity</h1>
        <button
          onClick={fetchIntegrity}
          disabled={refreshing}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 border-2 border-slate-800 shadow-xl mb-8 text-center">
        {integrity?.overallValid ? (
          <div>
            <div className="inline-flex p-4 bg-green-500/10 rounded-full mb-4">
              <CheckCircle className="w-24 h-24 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-green-400 mb-3">Chain Integrity Valid</h2>
            <p className="text-slate-400 text-lg">All session hash chains are intact and tamper-free</p>
          </div>
        ) : (
          <div>
            <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-4">
              <XCircle className="w-24 h-24 text-red-400" />
            </div>
            <h2 className="text-4xl font-bold text-red-400 mb-3">Chain Integrity Issues Detected</h2>
            <p className="text-slate-400 text-lg">Some sessions have hash chain inconsistencies</p>
          </div>
        )}
        
        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 min-w-[140px]">
            <div className="text-4xl font-bold text-white mb-1">{validSessions}</div>
            <div className="text-sm text-slate-400">Valid Sessions</div>
          </div>
          <div className="w-px h-16 bg-slate-700"></div>
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 min-w-[140px]">
            <div className="text-4xl font-bold text-white mb-1">{totalSessions - validSessions}</div>
            <div className="text-sm text-slate-400">Invalid Sessions</div>
          </div>
          <div className="w-px h-16 bg-slate-700"></div>
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 min-w-[140px]">
            <div className="text-4xl font-bold text-white mb-1">{totalSessions}</div>
            <div className="text-sm text-slate-400">Total Sessions</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Session Details</h2>
        {integrity?.sessions?.map((session: any) => (
          <div
            key={session.sessionId}
            className={`bg-slate-900 rounded-xl p-6 border-2 shadow-lg ${
              session.valid ? 'border-green-500/30 hover:border-green-500/50' : 'border-red-500/30 hover:border-red-500/50'
            } transition-colors`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {session.valid ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <code className="text-sm font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">{session.sessionId}</code>
                </div>
                <div className="text-sm text-slate-400 ml-9">
                  {session.entryCount} entries in chain
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg text-xs font-bold border-2 ${
                session.valid
                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                  : 'bg-red-500/20 text-red-300 border-red-500/50'
              }`}>
                {session.valid ? 'VALID' : 'INVALID'}
              </div>
            </div>

            {session.errors && session.errors.length > 0 && (
              <div className="mt-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-bold text-red-400">
                    {session.errors.length} Error{session.errors.length > 1 ? 's' : ''} Detected
                  </span>
                </div>
                <div className="space-y-2">
                  {session.errors.map((error: string, index: number) => (
                    <div key={index} className="text-xs text-red-300 font-mono bg-red-950/50 p-3 rounded-lg border border-red-900/50">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">About Hash Chain Integrity</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            Each audit entry is cryptographically linked to the previous entry using SHA-256 hashing.
            This creates a tamper-evident chain where any modification to historical data would break
            the chain and be immediately detectable.
          </p>
          <p>
            The integrity verification checks:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-400">
            <li>Each entry's hash matches its computed hash</li>
            <li>Each entry's previousHash matches the previous entry's hash</li>
            <li>The first entry in each session has previousHash = '0'</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
