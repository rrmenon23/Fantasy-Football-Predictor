import { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import ChatInterface from './components/Chat/ChatInterface';
import PlayerSearch from './components/Players/PlayerSearch';
import LineupBuilder from './components/Lineup/LineupBuilder';

type View = 'chat' | 'players' | 'lineup' | 'league';

function App() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'players':
        return <PlayerSearch />;
      case 'lineup':
        return <LineupBuilder />;
      case 'league':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            League features coming soon...
          </div>
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;