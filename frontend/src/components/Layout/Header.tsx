import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  currentView: string;
}

const Header = ({ onMenuClick, currentView }: HeaderProps) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'chat':
        return 'AI Assistant';
      case 'players':
        return 'Player Search';
      case 'lineup':
        return 'Lineup Builder';
      case 'league':
        return 'My Leagues';
      default:
        return 'Fantasy Football AI';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏈</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
            Fantasy Football AI
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Current View:</span>
          <span className="text-sm font-semibold text-gray-900">{getViewTitle()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;