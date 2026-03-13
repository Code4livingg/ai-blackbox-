import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight, Clock, Download, Search, Sparkles } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import HashDisplay from '../components/HashDisplay';
import { DEMO_MODE, generateDemoSessions } from '../demo/demoEngine';

const API_URL = '/api';

interface SessionsPageProps {
  onInvestigate?: (sessionId: string) => void;
}

export default function SessionsPage({ onInvestigate }: SessionsPageProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (DEMO_MODE) {
      const demoSessions = generateDemoSessions(15);
      setSessions(demoSessions);
      setLoading(false);
    } else {
      fetchSessions();
    }
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/sessions`);
      setSessions(response.data.sessions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (session: any) => {
    if (DEMO_MODE) {
      setSelectedSession(session);
    } else {
      try {
        const response = await axios.get(`${API_URL}/session/${session}`);
        setSelectedSession(response.data);
      } catch (error) {
        console.error('Failed to fetch session details:', error);
      }
    }
  };

  const downloadAuditReport = async (sessionId: string) => {
    setDownloadingReport(true);
    try {
      let reportData;
      
      if (DEMO_MODE) {
        const session = sessions.find(s => s.id === sessionId);
        reportData = {
          session_id: sessionId,
          timestamp: session?.timestamp || new Date().toISOString(),
          prompt: session?.prompt || 'Demo prompt',
          response: session?.response || 'Demo response',
          risk_assessment: {
            score: session?.riskScore || 0,
            level: session?.riskLevel || 'LOW'
          },
          hash_chain: {
            current_hash: session?.hash || '0x0',
            verified: true
          },
          audit_trail: 'Complete forensic audit trail available',
          generated_at: new Date().toISOString()
        };
      } else {
        const response = await axios.get(`${API_URL}/session/${sessionId}/report`);
        reportData = response.data;
      }
      
      // Create downloadable JSON file
      const blob = new Blob(
        [JSON.stringify(reportData, null, 2)], 
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${sessionId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download audit report');
    } finally {
      setDownloadingReport(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (!searchTerm) return true;
    const prompt = DEMO_MODE ? session.prompt : session;
    return prompt.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div>
      {DEMO_MODE && (
        <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">DEMO SIMULATION MODE</span>
            <span className="text-slate-400">— Synthetic Session Data</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">AI Sessions</h1>
        <div className="text-slate-400">
          {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sessions by prompt..."
            className="w-full bg-slate-900 text-white rounded-xl p-4 pl-12 border border-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const sessionId = DEMO_MODE ? session.id : session;
            const isSelected = selectedSession && (DEMO_MODE ? selectedSession.id === session.id : selectedSession.sessionId === session);
            
            return (
              <div
                key={sessionId}
                onClick={() => fetchSessionDetails(session)}
                className={`bg-slate-900 rounded-xl p-5 border-2 cursor-pointer transition-all hover:border-blue-500/50 ${
                  isSelected ? 'border-blue-500' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-white font-semibold mb-2 line-clamp-2">
                      {DEMO_MODE ? session.prompt : `Session ${session}`}
                    </div>
                    {DEMO_MODE && (
                      <div className="flex items-center gap-2 mb-2">
                        <RiskBadge level={session.riskLevel} />
                        <span className="text-slate-500 text-sm">Score: {session.riskScore}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {DEMO_MODE 
                    ? new Date(session.timestamp).toLocaleString()
                    : 'Click to view details'
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* Session Details */}
        <div className="lg:sticky lg:top-6 h-fit">
          {selectedSession ? (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Session Details</h2>
                <button
                  onClick={() => downloadAuditReport(DEMO_MODE ? selectedSession.id : selectedSession.sessionId)}
                  disabled={downloadingReport}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {downloadingReport ? 'Downloading...' : 'Download Report'}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-slate-400 text-sm mb-2">Session ID</div>
                  <div className="text-white font-mono bg-slate-950 p-3 rounded-lg border border-slate-700">
                    {DEMO_MODE ? selectedSession.id : selectedSession.sessionId}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-sm mb-2">Timestamp</div>
                  <div className="text-white">
                    {new Date(selectedSession.timestamp).toLocaleString()}
                  </div>
                </div>

                {DEMO_MODE && (
                  <>
                    <div>
                      <div className="text-slate-400 text-sm mb-2">Prompt</div>
                      <div className="text-white bg-slate-950 p-4 rounded-lg border border-slate-700">
                        {selectedSession.prompt}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-sm mb-2">Response</div>
                      <div className="text-white bg-slate-950 p-4 rounded-lg border border-slate-700">
                        {selectedSession.response}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-sm mb-2">Risk Assessment</div>
                      <div className="flex items-center gap-3">
                        <RiskBadge level={selectedSession.riskLevel} />
                        <span className="text-white">Score: {selectedSession.riskScore}/100</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-sm mb-2">Model</div>
                      <div className="text-white">{selectedSession.model}</div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-sm mb-2">Hash</div>
                      <HashDisplay hash={selectedSession.hash} />
                    </div>
                  </>
                )}

                {onInvestigate && (
                  <button
                    onClick={() => onInvestigate(DEMO_MODE ? selectedSession.id : selectedSession.sessionId)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                  >
                    Open Investigation View
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
              <div className="text-slate-400 mb-2">No session selected</div>
              <div className="text-slate-500 text-sm">Click on a session to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
