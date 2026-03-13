import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight, Clock, Download, Search } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import HashDisplay from '../components/HashDisplay';

const API_URL = 'http://localhost:3001';

interface SessionsPageProps {
  onInvestigate?: (sessionId: string) => void;
}

export default function SessionsPage({ onInvestigate }: SessionsPageProps) {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sessions`);
      setSessions(response.data.sessions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/session/${sessionId}`);
      setSelectedSession(response.data);
    } catch (error) {
      console.error('Failed to fetch session details:', error);
    }
  };

  const downloadAuditReport = async (sessionId: string) => {
    setDownloadingReport(true);
    try {
      const response = await axios.get(`${API_URL}/api/session/${sessionId}/report`);
      
      // Create downloadable JSON file
      const blob = new Blob(
        [JSON.stringify(response.data, null, 2)], 
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
      alert('Failed to download audit report. Please try again.');
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Sessions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 bg-slate-950">
              <h2 className="text-lg font-semibold text-white">All Sessions ({sessions.length})</h2>
            </div>
            <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
              {sessions.map((sessionId) => (
                <button
                  key={sessionId}
                  onClick={() => fetchSessionDetails(sessionId)}
                  className={`w-full p-4 text-left hover:bg-slate-800/50 transition-all flex items-center justify-between group ${
                    selectedSession?.sessionId === sessionId ? 'bg-slate-800/70 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono text-slate-300 truncate group-hover:text-white transition-colors">{sessionId}</div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-2 group-hover:text-blue-400 transition-colors ${
                    selectedSession?.sessionId === sessionId ? 'text-blue-400' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Session Timeline</h2>
                  <div className="flex gap-3">
                    {onInvestigate && (
                      <button
                        onClick={() => onInvestigate(selectedSession.sessionId)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-purple-500/50 font-semibold"
                      >
                        <Search className="w-4 h-4" />
                        Investigate
                      </button>
                    )}
                    <button
                      onClick={() => downloadAuditReport(selectedSession.sessionId)}
                      disabled={downloadingReport}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/50"
                    >
                      {downloadingReport ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Audit Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <span className="text-slate-400 text-sm block mb-1">Total Events</span>
                    <div className="text-3xl font-bold text-white">{selectedSession.timeline.summary.totalEvents}</div>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <span className="text-slate-400 text-sm block mb-1">Duration</span>
                    <div className="text-3xl font-bold text-white">
                      {(selectedSession.timeline.totalDuration / 1000).toFixed(1)}s
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <span className="text-slate-400 text-sm block mb-1">Final Risk</span>
                    <div className="mt-2">
                      {selectedSession.timeline.summary.finalRiskLevel && (
                        <RiskBadge level={selectedSession.timeline.summary.finalRiskLevel} />
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <span className="text-slate-400 text-sm block mb-1">Risk Escalations</span>
                    <div className="text-3xl font-bold text-white">
                      {selectedSession.timeline.riskEscalation.escalations.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Event Timeline</h3>
                <div className="space-y-4">
                  {selectedSession.timeline.events.map((event: any, index: number) => (
                    <div key={event.id} className="relative pl-8 pb-6 last:pb-0">
                      {index < selectedSession.timeline.events.length - 1 && (
                        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-slate-700"></div>
                      )}
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-lg shadow-blue-500/50"></div>
                      
                      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-blue-400 uppercase tracking-wide">{event.eventType}</span>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {new Date(event.timestamp).toLocaleTimeString()}
                            {event.durationSincePrevious && (
                              <span className="ml-2 bg-slate-800 px-2 py-0.5 rounded">+{(event.durationSincePrevious / 1000).toFixed(2)}s</span>
                            )}
                          </div>
                        </div>
                        
                        {event.data.prompt && (
                          <div className="text-slate-300 text-sm mb-2 bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-slate-500 font-semibold">Prompt:</span> {event.data.prompt}
                          </div>
                        )}
                        
                        {event.data.response && (
                          <div className="text-slate-300 text-sm mb-2 bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-slate-500 font-semibold">Response:</span>{' '}
                            {event.data.response.substring(0, 200)}
                            {event.data.response.length > 200 && '...'}
                          </div>
                        )}
                        
                        {event.data.riskLevel && (
                          <div className="flex items-center gap-2 mt-2">
                            <RiskBadge level={event.data.riskLevel} />
                            {event.data.riskReason && (
                              <span className="text-xs text-slate-400">{event.data.riskReason}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Hash Chain</h3>
                <div className="space-y-3">
                  {selectedSession.entries.map((entry: any, index: number) => (
                    <div key={entry.id} className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-blue-400 font-bold">Entry {index + 1}</span>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{entry.eventType}</span>
                      </div>
                      <div className="space-y-2">
                        <HashDisplay hash={entry.hash} label="Hash" />
                        <HashDisplay hash={entry.previousHash} label="Prev" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center shadow-lg">
              <div className="text-slate-400 text-lg">Select a session to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
