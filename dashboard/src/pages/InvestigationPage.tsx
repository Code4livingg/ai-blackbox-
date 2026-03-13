import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  FileText, 
  Shield,
  XCircle,
  Activity,
  Zap
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import HashDisplay from '../components/HashDisplay';

const API_URL = 'http://localhost:3001';

interface InvestigationPageProps {
  sessionId: string;
  onBack: () => void;
}

export default function InvestigationPage({ sessionId, onBack }: InvestigationPageProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/session/${sessionId}/report`);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      alert('Failed to load investigation data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadForensicReport = async () => {
    setDownloadingReport(true);
    try {
      const response = await axios.get(`${API_URL}/api/session/${sessionId}/report`);
      
      const blob = new Blob(
        [JSON.stringify(response.data, null, 2)], 
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forensic-investigation-${sessionId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download forensic report. Please try again.');
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-400">Loading investigation data...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <div className="text-slate-400">Failed to load investigation data</div>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const integrityStatus = report.integrityVerification.chainValid;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white mb-2 text-sm transition-colors"
          >
            ← Back to Sessions
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            Incident Investigation
          </h1>
        </div>
        <button
          onClick={downloadForensicReport}
          disabled={downloadingReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/50 font-semibold"
        >
          {downloadingReport ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Forensic Report
            </>
          )}
        </button>
      </div>

      {/* Session Overview Panel */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Session Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Session ID</div>
            <div className="text-white font-mono text-sm truncate" title={report.sessionId}>
              {report.sessionId}
            </div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Start Time</div>
            <div className="text-white text-sm">
              {new Date(report.startTimestamp).toLocaleTimeString()}
            </div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">End Time</div>
            <div className="text-white text-sm">
              {new Date(report.endTimestamp).toLocaleTimeString()}
            </div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Total Events</div>
            <div className="text-white text-2xl font-bold">{report.totalEvents}</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Final Risk</div>
            <div className="mt-2">
              {report.summary.finalRiskLevel ? (
                <RiskBadge level={report.summary.finalRiskLevel} />
              ) : (
                <span className="text-slate-500 text-sm">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Integrity Verification Panel */}
      <div className={`rounded-xl p-6 border-2 shadow-lg mb-6 ${
        integrityStatus 
          ? 'bg-green-500/5 border-green-500/30' 
          : 'bg-red-500/5 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {integrityStatus ? (
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            ) : (
              <div className="p-3 bg-red-500/20 rounded-full">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            )}
            <div>
              <h3 className={`text-xl font-bold ${integrityStatus ? 'text-green-400' : 'text-red-400'}`}>
                {integrityStatus ? 'Chain Integrity Valid' : 'Chain Integrity Compromised'}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {integrityStatus 
                  ? 'All cryptographic hashes verified successfully' 
                  : 'Tampering detected in audit chain'}
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{report.integrityVerification.entriesVerified}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Entries Verified</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${report.integrityVerification.tamperingDetected ? 'text-red-400' : 'text-green-400'}`}>
                {report.integrityVerification.tamperingDetected ? 'YES' : 'NO'}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Tampering</div>
            </div>
          </div>
        </div>
        {!integrityStatus && report.integrityVerification.errors && report.integrityVerification.errors.length > 0 && (
          <div className="mt-4 bg-red-950/50 border border-red-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">Integrity Errors:</span>
            </div>
            <div className="space-y-1">
              {report.integrityVerification.errors.map((error: string, index: number) => (
                <div key={index} className="text-xs text-red-300 font-mono">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prompt Display */}
      {report.prompt && (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Original Prompt
          </h3>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <p className="text-slate-300 leading-relaxed">{report.prompt}</p>
          </div>
        </div>
      )}

      {/* Model Comparison Panel */}
      {report.modelAnalysis && report.modelAnalysis.length > 0 && (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Cross-Model Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.modelAnalysis.map((model: any, index: number) => (
              <div key={index} className="bg-slate-950 rounded-lg p-5 border-2 border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{model.modelName}</h3>
                  <RiskBadge level={model.riskLevel} />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Response</div>
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 max-h-48 overflow-y-auto">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {model.response}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Risk Assessment</div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                      <p className="text-slate-400 text-xs">{model.riskReason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Timeline */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Event Timeline
        </h2>
        <div className="space-y-4">
          {report.timeline.map((event: any, index: number) => (
            <div key={index} className="relative pl-8 pb-6 last:pb-0">
              {index < report.timeline.length - 1 && (
                <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-slate-700"></div>
              )}
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-lg shadow-blue-500/50"></div>
              
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-blue-400 uppercase tracking-wide">
                    {event.eventType.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(event.timestamp).toLocaleTimeString()}
                    {event.durationSincePrevious !== null && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded">
                        +{(event.durationSincePrevious / 1000).toFixed(2)}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Evidence Panel */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Audit Evidence (Hash Chain)
        </h2>
        <div className="space-y-3">
          {report.auditHashes.map((hash: any, index: number) => (
            <div key={index} className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-blue-400 font-bold">Entry {index + 1}</span>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded font-mono">
                  {hash.entryId.substring(0, 8)}
                </span>
              </div>
              <div className="space-y-2">
                <HashDisplay hash={hash.hash} label="Hash" truncate={false} />
                <HashDisplay hash={hash.previousHash} label="Prev" truncate={false} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Investigation Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-center">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Duration</div>
            <div className="text-white text-xl font-bold">
              {(report.summary.totalDuration / 1000).toFixed(1)}s
            </div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-center">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Prompts</div>
            <div className="text-white text-xl font-bold">{report.summary.promptCount}</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-center">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Responses</div>
            <div className="text-white text-xl font-bold">{report.summary.responseCount}</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-center">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Risk Escalations</div>
            <div className={`text-xl font-bold ${
              report.summary.riskEscalationDetected ? 'text-red-400' : 'text-green-400'
            }`}>
              {report.summary.riskEscalations.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
