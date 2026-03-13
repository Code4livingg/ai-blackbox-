import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Database, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = '/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingDemo, setGeneratingDemo] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/stats`);
      
      setStats(statsRes.data);
      
      // Generate chart data
      const data = [];
      const now = Date.now();
      for (let i = 6; i >= 0; i--) {
        data.push({
          time: new Date(now - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          interactions: Math.floor(Math.random() * 20) + 5,
        });
      }
      setChartData(data);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const handleGenerateDemo = async () => {
    setGeneratingDemo(true);
    try {
      await axios.post(`${API_URL}/demo`);
      // Refresh data after generating demo
      await fetchData();
      alert('Demo activity generated successfully!');
    } catch (error) {
      console.error('Failed to generate demo:', error);
      alert('Failed to generate demo activity');
    } finally {
      setGeneratingDemo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={handleGenerateDemo}
          disabled={generatingDemo}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          {generatingDemo ? 'Generating...' : 'Generate Demo AI Activity'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Total Entries</span>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white">{stats?.totalEntries || 0}</div>
          <div className="text-xs text-slate-500 mt-2">Audit log entries</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Total Sessions</span>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white">{stats?.totalSessions || 0}</div>
          <div className="text-xs text-slate-500 mt-2">Active sessions</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Chain Integrity</span>
            <div className={`p-2 rounded-lg ${stats?.chainValid ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {stats?.chainValid ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
          <div className={`text-4xl font-bold ${stats?.chainValid ? 'text-green-400' : 'text-red-400'}`}>
            {stats?.chainValid ? 'Valid' : 'Invalid'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Hash chain status</div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Latest Entry</span>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.newestEntry
              ? new Date(stats.newestEntry).toLocaleTimeString()
              : 'N/A'}
          </div>
          <div className="text-xs text-slate-500 mt-2">Last activity</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Interactions Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                color: '#fff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="interactions"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#1e40af' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-6">Risk Distribution</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-500/5 border-2 border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
            <div className="text-green-400 text-sm font-semibold mb-2">LOW RISK</div>
            <div className="text-4xl font-bold text-white mb-1">{stats?.riskDistribution?.LOW || 0}</div>
            <div className="text-xs text-slate-500">Safe interactions</div>
          </div>
          <div className="bg-yellow-500/5 border-2 border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-colors">
            <div className="text-yellow-400 text-sm font-semibold mb-2">MEDIUM RISK</div>
            <div className="text-4xl font-bold text-white mb-1">{stats?.riskDistribution?.MEDIUM || 0}</div>
            <div className="text-xs text-slate-500">Sensitive topics</div>
          </div>
          <div className="bg-red-500/5 border-2 border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-colors">
            <div className="text-red-400 text-sm font-semibold mb-2">HIGH RISK</div>
            <div className="text-4xl font-bold text-white mb-1">{stats?.riskDistribution?.HIGH || 0}</div>
            <div className="text-xs text-slate-500">Dangerous content</div>
          </div>
        </div>
      </div>
    </div>
  );
}
