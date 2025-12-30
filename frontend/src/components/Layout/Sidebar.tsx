import { MessageSquare, Users, ClipboardList, Trophy, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: 'chat' | 'players' | 'lineup' | 'league') => void;
}

const Sidebar = ({ isOpen, onClose, currentView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'lineup', label: 'Lineup', icon: ClipboardList },
    { id: 'league', label: 'Leagues', icon: Trophy },
  ];

  const handleViewChange = (view: 'chat' | 'players' | 'lineup' | 'league') => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id as any)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-colors text-left
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer info */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Powered by Claude AI</p>
              <p>Data from Sleeper API</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;