import { Shield, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [demoPrompt, setDemoPrompt] = useState('');
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const handleDemoAnalyze = async () => {
    if (!demoPrompt.trim()) return;
    
    setIsAnalyzing(true);
    setDemoResult(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: demoPrompt })
      });
      
      const data = await response.json();
      setDemoResult(data);
    } catch (error) {
      setDemoResult({ error: 'Failed to analyze. Make sure the backend is running.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050712] text-slate-100 overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none z-0" />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-sweep" />
      </div>

      <nav className="sticky top-0 z-50 bg-[#050712]/70 backdrop-blur-xl border-b border-slate-800/50 transition-all relative">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 hover:scale-105 transition-transform">
              <img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-8 w-8 drop-shadow-[0_0_8px_rgba(0,225,255,0.6)]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#6ea8ff] to-[#00e1ff] bg-clip-text text-transparent">
                AI Blackbox
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="https://github.com/Code4livingg/ai-blackbox-.git" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#00e1ff] transition-colors font-medium">
                GitHub
              </a>
            </div>

            <button 
              onClick={() => onNavigate('dashboard')} 
              className="relative bg-gradient-to-r from-[#1da1ff] to-[#00e1ff] text-white px-6 py-2 rounded-xl font-semibold overflow-hidden group hover:scale-105 transition-transform"
            >
              <span className="relative z-10">Open Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00e1ff] to-[#1da1ff] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </nav>

      <section className="relative py-32 md:py-48 overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#1da1ff] rounded-full blur-[150px] opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#00e1ff] rounded-full blur-[120px] opacity-25 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="mb-12 relative flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full blur-[80px] animate-pulse-slow" 
                   style={{ background: 'radial-gradient(circle, rgba(0,225,255,0.35) 0%, transparent 70%)' }} />
            </div>
            
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img 
                src="/aiblackbox-logo.png" 
                alt="AI Blackbox" 
                className="w-56 md:w-64 drop-shadow-[0_0_60px_rgba(0,225,255,0.8)] object-contain"
              />
            </motion.div>
          </div>

          <div className="space-y-6 mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-[#00e1ff] to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                AI Blackbox
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#00e1ff] drop-shadow-[0_0_20px_rgba(0,225,255,0.5)]"
            >
              Forensic Accountability for AI Systems
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
            >
              Record, verify, and reconstruct every AI decision using tamper-evident audit trails powered by AWS infrastructure.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
          >
            <button 
              onClick={() => onNavigate('analyze')} 
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#1da1ff] to-[#00e1ff] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10">Analyze AI Risk</span>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,225,255,0.5),0_0_40px_rgba(0,225,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="group relative inline-flex items-center justify-center gap-3 bg-[#0b1025] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg border-2 border-[#1da1ff]/50 hover:border-[#00e1ff] overflow-hidden hover:scale-105 transition-all"
            >
              <span className="relative z-10">Open Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1da1ff]/10 to-[#00e1ff]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl backdrop-blur-xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,225,255,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-[#1da1ff] to-[#00e1ff] rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Try AI Blackbox Live</h3>
              </div>
              
              <p className="text-sm md:text-base text-slate-400 mb-6">
                Analyze prompt safety using Amazon Bedrock risk classification in real-time.
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                  placeholder="Enter a prompt to analyze AI risk... (e.g., 'How do I bypass authentication systems?')"
                  className="w-full h-32 bg-[#0b1025] border border-[#1da1ff]/30 rounded-lg px-4 py-3 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#00e1ff] focus:ring-2 focus:ring-[#00e1ff]/20 transition-all resize-none"
                />
                
                <button
                  onClick={handleDemoAnalyze}
                  disabled={isAnalyzing || !demoPrompt.trim()}
                  className="w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#1da1ff] to-[#00e1ff] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg overflow-hidden hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Analyze AI Risk</span>
                    </>
                  )}
                </button>
              </div>

              {demoResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 bg-[#0b1025] border-2 border-[#1da1ff]/40 rounded-xl p-4 md:p-6 space-y-4"
                >
                  {demoResult.error ? (
                    <div className="text-red-400 text-center py-4">
                      <p className="font-semibold mb-2">⚠️ Error</p>
                      <p className="text-sm">{demoResult.error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h4 className="text-lg md:text-xl font-bold text-white">Analysis Result</h4>
                        <div className={`px-3 md:px-4 py-2 rounded-lg font-bold text-sm md:text-base ${
                          demoResult.severityLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                          demoResult.severityLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                          'bg-green-500/20 text-green-400 border border-green-500/50'
                        }`}>
                          {demoResult.severityLevel} RISK
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-[#1da1ff]/20">
                          <p className="text-slate-400 text-xs md:text-sm mb-1">Risk Score</p>
                          <p className="text-2xl md:text-3xl font-bold text-[#00e1ff]">{demoResult.severityScore}</p>
                        </div>
                        
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-[#1da1ff]/20">
                          <p className="text-slate-400 text-xs md:text-sm mb-1">Models Analyzed</p>
                          <p className="text-2xl md:text-3xl font-bold text-[#00e1ff]">{demoResult.models?.length || 0}</p>
                        </div>
                      </div>
                      
                      {demoResult.riskFactors && demoResult.riskFactors.length > 0 && (
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-[#1da1ff]/20">
                          <p className="text-slate-400 text-xs md:text-sm mb-3">Detected Threat Signals</p>
                          <ul className="space-y-2">
                            {demoResult.riskFactors.map((factor: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                                <span className="text-[#00e1ff] mt-1">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-full text-center text-[#00e1ff] hover:text-cyan-400 transition-colors text-xs md:text-sm font-medium py-2"
                      >
                        View Full Analysis in Dashboard →
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative bg-[#050712] border-t border-[#1da1ff]/20 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-8 drop-shadow-[0_0_8px_rgba(0,225,255,0.6)]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#6ea8ff] to-[#00e1ff] bg-clip-text text-transparent">
              AI Blackbox
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Forensic accountability for AI systems. Built for AWS 10,000 AIdeas Competition.
          </p>
          <div className="text-slate-500 text-sm">
            © 2026 AI Blackbox. Powered by AWS.
          </div>
        </div>
      </footer>
    </div>
  );
}
