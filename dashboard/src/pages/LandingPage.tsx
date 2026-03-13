import { Shield, Github, ExternalLink, ChevronRight, Check, Database, Cloud, Zap, Lock, Activity, FileSearch } from 'lucide-react';

export default function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Glowing Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">AI Blackbox</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('architecture')} className="text-slate-400 hover:text-white transition-colors">
                Architecture
              </button>
              <button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('demo')} className="text-slate-400 hover:text-white transition-colors">
                Demo
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                GitHub
              </a>
            </div>

            <button onClick={() => onNavigate('dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 font-semibold">
              Open Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Hero Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        
        {/* Radial Spotlight Glow */}
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-blue-500 rounded-full blur-[120px] opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        {/* Hero Content - Centered */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img 
              src="/aiblackbox-logo.png" 
              alt="AI Blackbox" 
              className="w-48 md:w-56 mx-auto drop-shadow-[0_0_40px_rgba(59,130,246,0.7)]"
            />
          </div>

          {/* Title */}
          <div className="space-y-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              AI Blackbox
            </h1>
            <p className="text-2xl md:text-3xl text-blue-400 font-semibold">
              Forensic Accountability for AI Systems
            </p>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Record, verify, and reconstruct every AI decision using tamper-evident audit trails powered by AWS infrastructure.
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">Tamper-Evident Hash Chains</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">Amazon Bedrock AI Risk Analysis</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">DynamoDB + S3 Immutable Logs</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm">Forensic Replay Dashboard</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => onNavigate('dashboard')} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 font-semibold text-lg hover:scale-105 active:scale-95">
              View Investigation Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => scrollToSection('architecture')} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg transition-all border border-slate-700 hover:border-blue-400 font-semibold text-lg hover:scale-105 active:scale-95">
              Explore Architecture
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar - AWS Infrastructure */}
      <section className="relative py-8 border-t border-b border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Powered by AWS Infrastructure</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { name: 'Amazon Bedrock', icon: Cloud },
              { name: 'DynamoDB', icon: Database },
              { name: 'Amazon S3', icon: Shield },
              { name: 'AWS Lambda', icon: Zap }
            ].map((service, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                <service.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWS Powered Section */}
      <section id="architecture" className="relative py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powered by AWS Infrastructure
            </h2>
            <p className="text-xl text-slate-400">
              Enterprise-grade cloud services for mission-critical AI accountability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Amazon Bedrock',
                description: 'AI inference and risk classification',
                icon: Cloud,
                color: 'blue'
              },
              {
                title: 'DynamoDB',
                description: 'High-speed indexed audit storage',
                icon: Database,
                color: 'purple'
              },
              {
                title: 'Amazon S3',
                description: 'Immutable audit archive',
                icon: Shield,
                color: 'green'
              },
              {
                title: 'Lambda / Serverless APIs',
                description: 'Scalable backend execution',
                icon: Zap,
                color: 'yellow'
              }
            ].map((service, index) => (
              <div key={index} className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20 hover:shadow-xl">
                <div className={`p-3 bg-${service.color}-600/20 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-8 h-8 text-${service.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Core Features
            </h2>
            <p className="text-xl text-slate-400">
              Complete forensic accountability for AI decision-making
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Tamper-Evident Logging',
                description: 'Every audit entry is cryptographically chained using SHA-256. Any modification to historical records is immediately detectable through hash verification.',
                icon: Lock,
                gradient: 'from-blue-600 to-cyan-600'
              },
              {
                title: 'AI Risk Analysis',
                description: 'Amazon Bedrock models evaluate prompts and responses for safety risk. Multi-model consensus provides robust threat detection.',
                icon: Activity,
                gradient: 'from-purple-600 to-pink-600'
              },
              {
                title: 'Forensic Replay',
                description: 'Investigators can reconstruct the full decision timeline of any AI session. Complete audit trail with timestamps and integrity verification.',
                icon: FileSearch,
                gradient: 'from-green-600 to-emerald-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20 hover:shadow-xl">
                <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className="relative py-24 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              System Architecture
            </h2>
            <p className="text-xl text-slate-400">
              End-to-end forensic accountability pipeline
            </p>
          </div>

          <div className="space-y-4">
            {[
              'User / AI System',
              'AI Blackbox API',
              'Amazon Bedrock',
              'Risk Analysis Engine',
              'Hash Chain Integrity',
              'DynamoDB + S3 Storage',
              'Forensic Investigation Dashboard'
            ].map((step, index, arr) => (
              <div key={index}>
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-blue-500/40 rounded-xl p-6 hover:border-blue-500/70 transition-all shadow-xl hover:shadow-blue-500/30 hover:shadow-2xl">
                  <div className="flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{step}</span>
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <div className="flex justify-center py-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Resources Section */}
      <section id="demo" className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-12 shadow-2xl hover:shadow-blue-500/10 transition-all">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Developer Resources
              </h2>
              <p className="text-xl text-slate-400">
                Explore the code, documentation, and architecture
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                { label: 'GitHub Repository', icon: Github, href: 'https://github.com' },
                { label: 'Project Documentation', icon: FileSearch, href: '#' },
                { label: 'AWS Architecture', icon: Cloud, href: '#' },
                { label: 'Demo Video', icon: ExternalLink, href: '#' }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-slate-950 border border-slate-700 hover:border-blue-500/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-blue-500/20 group hover:bg-slate-900"
                >
                  <link.icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-semibold flex-1">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => onNavigate('dashboard')} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 font-semibold text-lg hover:scale-105 active:scale-95">
                Launch Investigation Dashboard
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/aiblackbox-logo.png" alt="AI Blackbox" className="h-6 opacity-80 hover:opacity-100 transition-opacity" />
                <span className="text-lg font-bold text-white">AI Blackbox</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Built for AWS 10,000 AIdeas Competition
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Links</h3>
              <div className="space-y-2">
                {['GitHub', 'LinkedIn', 'Portfolio', 'Email'].map((link) => (
                  <a key={link} href="#" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Tech Stack</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="hover:text-blue-400 transition-colors">Amazon Bedrock</div>
                <div className="hover:text-blue-400 transition-colors">DynamoDB</div>
                <div className="hover:text-blue-400 transition-colors">S3</div>
                <div className="hover:text-blue-400 transition-colors">React</div>
              </div>
            </div>

            {/* Additional */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">More</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="hover:text-blue-400 transition-colors">TypeScript</div>
                <div className="hover:text-blue-400 transition-colors">Vite</div>
                <div className="hover:text-blue-400 transition-colors">TailwindCSS</div>
                <div className="hover:text-blue-400 transition-colors">AWS Lambda</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © 2026 AI Blackbox. Forensic Accountability for AI Systems.
          </div>
        </div>
      </footer>
    </div>
  );
}
