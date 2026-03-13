import { useState } from 'react';
import { LayoutDashboard, Search, List, Shield } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import SessionsPage from './pages/SessionsPage';
import IntegrityPage from './pages/IntegrityPage';
import InvestigationPage from './pages/InvestigationPage';

type Page = 'landing' | 'dashboard' | 'analyze' | 'sessions' | 'integrity' | 'investigation';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [investigationSessionId, setInvestigationSessionId] = useState<string | null>(null);

  const navigation = [
    { id: 'dashboard' as Page, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze' as Page, name: 'Analyze', icon: Search },
    { id: 'sessions' as Page, name: 'Sessions', icon: List },
    { id: 'integrity' as Page, name: 'Integrity', icon: Shield },
  ];

  const navigateToInvestigation = (sessionId: string) => {
    setInvestigationSessionId(sessionId);
    setCurrentPage('investigation');
  };

  const navigateBackToSessions = () => {
    setCurrentPage('sessions');
    setInvestigationSessionId(null);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'analyze':
        return <AnalyzePage />;
      case 'sessions':
        return <SessionsPage onInvestigate={navigateToInvestigation} />;
      case 'integrity':
        return <IntegrityPage />;
      case 'investigation':
        return investigationSessionId ? (
          <InvestigationPage 
            sessionId={investigationSessionId} 
            onBack={navigateBackToSessions}
          />
        ) : (
          <DashboardPage />
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : (
        <div className="min-h-screen bg-slate-950 flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg p-1.5">
                  <img src="/aiblackbox-logo.png" alt="AI Blackbox" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-white">AI Blackbox</h1>
                  <p className="text-xs text-slate-400">Forensic Accountability</p>
                </div>
              </button>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">AWS Region</div>
                <div className="text-sm font-semibold text-white">ap-south-1</div>
                <div className="text-xs text-slate-500 mt-3 mb-1">Model</div>
                <div className="text-sm font-semibold text-white">Nova Micro</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-slate-950">
            <div className="p-8">{renderPage()}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
