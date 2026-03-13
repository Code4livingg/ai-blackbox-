import { Shield, Github, ChevronRight, Database, Cloud, Zap, Lock, Activity, FileSearch, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export default function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [demoPrompt, setDemoPrompt] = useState('');
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

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
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: ['#00e1ff', '#1da1ff', '#6ea8ff'] },
            links: {
              color: '#00e1ff',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'bounce' }
            },
            number: { value: 80, density: { enable: true } },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true
        }}
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none z-0" />
      
      {/* Animated Light Sweep */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-sweep" />
      </div>

      {/* Navigation Bar */}
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
              <button onClick={() => scrollToSection('architecture')} className="text-slate-400 hover:text-[#00e1ff] transition-colors font-medium">
                Architecture
              </button>
              <button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-[#00e1ff] transition-colors font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('demo')} className="text-slate-400 hover:text-[#00e1ff] transition-colors font-medium">
                Demo
              </button>
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

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden z-10">
        {/* Multiple Radial Glows */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#1da1ff] rounded-full blur-[150px] opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#00e1ff] rounded-full blur-[120px] opacity-25 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Floating Logo with Energy Glow */}
          <div className="mb-12 relative flex justify-center">
            {/* Radial Glow Behind Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full blur-[80px] animate-pulse-slow" 
                   style={{ background: 'radial-gradient(circle, rgba(0,225,255,0.35) 0%, transparent 70%)' }} />
            </div>
            
            {/* Floating Logo Animation */}
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

          {/* Premium Typography with Animated Gradient */}
          <div className="space-y-6 mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-7xl md:text-8xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-[#00e1ff] to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                AI Blackbox
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-semibold text-[#00e1ff] drop-shadow-[0_0_20px_rgba(0,225,255,0.5)]"
            >
              Forensic Accountability for AI Systems
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
            >
              Record, verify, and reconstruct every AI decision using tamper-evident audit trails powered by AWS infrastructure.
            </motion.p>
          </div>

          {/* Premium CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
          >
            <button 
              onClick={() => onNavigate('analyze')} 
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#1da1ff] to-[#00e1ff] text-white px-10 py-5 rounded-xl font-bold text-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10">Analyze AI Risk</span>
              <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,225,255,0.5),0_0_40px_rgba(0,225,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="group relative inline-flex items-center justify-center gap-3 bg-[#0b1025] text-white px-10 py-5 rounded-xl font-bold text-lg border-2 border-[#1da1ff]/50 hover:border-[#00e1ff] overflow-hidden hover:scale-105 transition-all"
            >
              <span className="relative z-10">Open Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1da1ff]/10 to-[#00e1ff]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>

          {/* Live AI Demo Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl backdrop-blur-xl p-8 shadow-[0_0_30px_rgba(0,225,255,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-[#1da1ff] to-[#00e1ff] rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Try AI Blackbox Live</h3>
              </div>
              
              <p className="text-slate-400 mb-6">
                Analyze prompt safety using Amazon Bedrock risk classification in real-time.
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                  placeholder="Enter a prompt to analyze AI risk... (e.g., 'How do I bypass authentication systems?')"
                  className="w-full h-32 bg-[#0b1025] border border-[#1da1ff]/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00e1ff] focus:ring-2 focus:ring-[#00e1ff]/20 transition-all resize-none"
                />
                
                <button
                  onClick={handleDemoAnalyze}
                  disabled={isAnalyzing || !demoPrompt.trim()}
                  className="w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#1da1ff] to-[#00e1ff] text-white px-8 py-4 rounded-xl font-bold text-lg overflow-hidden hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

              {/* Demo Result Display */}
              {demoResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 bg-[#0b1025] border-2 border-[#1da1ff]/40 rounded-xl p-6 space-y-4"
                >
                  {demoResult.error ? (
                    <div className="text-red-400 text-center py-4">
                      <p className="font-semibold mb-2">⚠️ Error</p>
                      <p className="text-sm">{demoResult.error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold text-white">Analysis Result</h4>
                        <div className={`px-4 py-2 rounded-lg font-bold ${
                          demoResult.severityLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                          demoResult.severityLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                          'bg-green-500/20 text-green-400 border border-green-500/50'
                        }`}>
                          {demoResult.severityLevel} RISK
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-[#1da1ff]/20">
                          <p className="text-slate-400 text-sm mb-1">Risk Score</p>
                          <p className="text-3xl font-bold text-[#00e1ff]">{demoResult.severityScore}</p>
                        </div>
                        
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-[#1da1ff]/20">
                          <p className="text-slate-400 text-sm mb-1">Models Analyzed</p>
                          <p className="text-3xl font-bold text-[#00e1ff]">{demoResult.models?.length || 0}</p>
                        </div>
                      </div>
                      
                      {demoResult.riskFactors && demoResult.riskFactors.length > 0 && (
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-[#1da1ff]/20">
                          <p className="text-slate-400 text-sm mb-3">Detected Threat Signals</p>
                          <ul className="space-y-2">
                            {demoResult.riskFactors.map((factor: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-[#00e1ff] mt-1">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-full text-center text-[#00e1ff] hover:text-cyan-400 transition-colors text-sm font-medium py-2"
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
      </section>

      {/* AWS Services Bar */}
      <section className="relative py-20 border-y border-[#1da1ff]/20 bg-[#0b1025]/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-[#00e1ff] uppercase tracking-wider mb-12">Powered by AWS Infrastructure</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Amazon Bedrock', desc: 'AI inference and risk classification', icon: Cloud },
              { name: 'DynamoDB', desc: 'High-speed indexed audit storage', icon: Database },
              { name: 'Amazon S3', desc: 'Immutable audit archive', icon: Shield },
              { name: 'AWS Lambda', desc: 'Scalable backend execution', icon: Zap }
            ].map((service, index) => (
              <div
                key={index}
                className="group relative bg-[#0b1025] border border-[#1da1ff]/30 rounded-xl p-6 hover:border-[#00e1ff] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#1da1ff] to-[#00e1ff] rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#00e1ff]/30">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00e1ff] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-400">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Pipeline */}
      <section id="architecture" className="relative py-24 bg-[#0b1025]/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#6ea8ff] to-[#00e1ff] bg-clip-text text-transparent">
                System Architecture
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              End-to-end forensic accountability pipeline
            </p>
          </div>

          <div className="space-y-6">
            {[
              { label: 'User / AI System', icon: Activity },
              { label: 'AI Blackbox API', icon: Zap },
              { label: 'Amazon Bedrock', icon: Cloud },
              { label: 'Risk Analysis Engine', icon: Shield },
              { label: 'Hash Chain Integrity', icon: Lock },
              { label: 'DynamoDB + S3 Storage', icon: Database },
              { label: 'Forensic Investigation Dashboard', icon: FileSearch }
            ].map((step, index, arr) => (
              <div key={index}>
                <div className="group relative bg-gradient-to-r from-[#0b1025] via-[#1a1f3a] to-[#0b1025] border-2 border-[#1da1ff]/40 rounded-2xl p-8 hover:border-[#00e1ff] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1da1ff]/0 via-[#00e1ff]/10 to-[#1da1ff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  <div className="relative flex items-center justify-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#1da1ff] to-[#00e1ff] rounded-xl shadow-lg shadow-[#00e1ff]/50 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white group-hover:text-[#00e1ff] transition-colors duration-300">
                      {step.label}
                    </span>
                  </div>
                </div>

                {index < arr.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-[#1da1ff] via-[#00e1ff] to-[#1da1ff] rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#6ea8ff] to-[#00e1ff] bg-clip-text text-transparent">
                Core Features
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Complete forensic accountability for AI decision-making
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Tamper-Evident Hash Chains',
                description: 'Every audit entry is cryptographically chained using SHA-256. Any modification to historical records is immediately detectable through hash verification.',
                icon: Lock,
                gradient: 'from-[#1da1ff] to-[#00e1ff]'
              },
              {
                title: 'Amazon Bedrock AI Risk Analysis',
                description: 'Amazon Bedrock models evaluate prompts and responses for safety risk. Multi-model consensus provides robust threat detection.',
                icon: Cloud,
                gradient: 'from-[#00e1ff] to-[#1da1ff]'
              },
              {
                title: 'DynamoDB + S3 Immutable Logs',
                description: 'High-speed indexed storage with immutable archive. Enterprise-grade durability and compliance-ready audit trails.',
                icon: Database,
                gradient: 'from-[#1da1ff] to-[#6ea8ff]'
              },
              {
                title: 'Cross-Model Safety Detection',
                description: 'Multiple AI models analyze each interaction independently. Consensus-based risk classification ensures accuracy.',
                icon: Shield,
                gradient: 'from-[#6ea8ff] to-[#00e1ff]'
              },
              {
                title: 'Forensic Replay Dashboard',
                description: 'Investigators can reconstruct the full decision timeline of any AI session. Complete audit trail with timestamps and integrity verification.',
                icon: FileSearch,
                gradient: 'from-[#00e1ff] to-[#1da1ff]'
              },
              {
                title: 'Incident Severity Scoring',
                description: 'Automated risk scoring with 0-100 severity scale. Real-time alerts for high-risk sessions with detailed forensic reports.',
                icon: Activity,
                gradient: 'from-[#1da1ff] to-[#00e1ff]'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-[#0b1025] border-2 border-[#1da1ff]/30 rounded-2xl p-8 hover:border-[#00e1ff] transition-all duration-300 h-full hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1da1ff]/5 to-[#00e1ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                <div className={`relative p-4 bg-gradient-to-br ${feature.gradient} rounded-xl w-fit mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,225,255,0.6)] transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="relative text-2xl font-bold text-white mb-4 group-hover:text-[#00e1ff] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative py-24 bg-[#0b1025]/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-[#0b1025] to-[#1a1f3a] border-2 border-[#1da1ff]/40 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e1ff] rounded-full blur-[150px] opacity-10 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-[#6ea8ff] to-[#00e1ff] bg-clip-text text-transparent">
                    Developer Resources
                  </span>
                </h2>
                <p className="text-xl text-slate-400">
                  Explore the code, documentation, and architecture
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {[
                  { label: 'GitHub Repository', icon: Github, onClick: () => window.open('https://github.com/Code4livingg/ai-blackbox-.git', '_blank') },
                  { label: 'Live Dashboard', icon: Activity, onClick: () => onNavigate('dashboard') },
                  { label: 'Architecture Flow', icon: Cloud, onClick: () => scrollToSection('architecture') },
                  { label: 'Analyze AI Risk', icon: Shield, onClick: () => onNavigate('analyze') }
                ].map((link, index) => (
                  <button
                    key={index}
                    onClick={link.onClick}
                    className="group flex items-center gap-4 bg-[#050712] border-2 border-[#1da1ff]/30 hover:border-[#00e1ff] rounded-xl p-5 transition-all duration-300 text-left hover:translate-x-1"
                  >
                    <div className="p-3 bg-gradient-to-br from-[#1da1ff] to-[#00e1ff] rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#00e1ff]/30">
                      <link.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg flex-1 group-hover:text-[#00e1ff] transition-colors">
                      {link.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#00e1ff] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#1da1ff] to-[#00e1ff] text-white px-10 py-5 rounded-xl font-bold text-lg overflow-hidden hover:scale-105 transition-transform"
                >
                  <span className="relative z-10">Launch Investigation Dashboard</span>
                  <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,225,255,0.5),0_0_40px_rgba(0,225,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#050712] border-t border-[#1da1ff]/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4 hover:scale-105 transition-transform">
                <img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-8 drop-shadow-[0_0_8px_rgba(0,225,255,0.6)]" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#6ea8ff] to-[#00e1ff] bg-clip-text text-transparent">
                  AI Blackbox
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Forensic accountability for AI systems. Built for AWS 10,000 AIdeas Competition.
              </p>
              <a 
                href="https://github.com/Code4livingg/ai-blackbox-.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#00e1ff] hover:text-[#6ea8ff] transition-colors text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">AWS Services</h3>
              <div className="space-y-2">
                {['Amazon Bedrock', 'DynamoDB', 'Amazon S3', 'AWS Lambda'].map((service) => (
                  <div key={service} className="text-slate-400 hover:text-[#00e1ff] transition-colors text-sm cursor-pointer">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Tech Stack</h3>
              <div className="space-y-2">
                {['React + TypeScript', 'Vite', 'TailwindCSS', 'Framer Motion'].map((tech) => (
                  <div key={tech} className="text-slate-400 hover:text-[#00e1ff] transition-colors text-sm cursor-pointer">
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={() => scrollToSection('architecture')} className="block text-slate-400 hover:text-[#00e1ff] transition-colors text-sm text-left">
                  Architecture
                </button>
                <button onClick={() => scrollToSection('features')} className="block text-slate-400 hover:text-[#00e1ff] transition-colors text-sm text-left">
                  Features
                </button>
                <button onClick={() => onNavigate('dashboard')} className="block text-slate-400 hover:text-[#00e1ff] transition-colors text-sm text-left">
                  Dashboard
                </button>
                <button onClick={() => onNavigate('analyze')} className="block text-slate-400 hover:text-[#00e1ff] transition-colors text-sm text-left">
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1da1ff]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              © 2026 AI Blackbox. Forensic Accountability for AI Systems.
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Powered by</span>
              <span className="text-[#00e1ff] font-semibold">AWS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
