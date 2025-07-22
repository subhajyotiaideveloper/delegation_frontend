import React from 'react';
import { Bell, Search, User, Menu, Settings } from 'lucide-react';

interface HeaderProps {
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  onMenuToggle: () => void;
  onViewChange?: (view: string) => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onMenuToggle, onViewChange, onLogout }) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const displayName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : 'Guest';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DW</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900">Delegation Workflow</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Settings className="w-5 h-5" onClick={() => onViewChange && onViewChange('settings')} />
            </button>
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">{displayName}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => { setUserMenuOpen(false); onViewChange && onViewChange('settings'); }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => { setUserMenuOpen(false); onViewChange && onViewChange('my-tasks'); }}
                  >
                    My Tasks
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => { setUserMenuOpen(false); onViewChange && onViewChange('settings'); }}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => { setUserMenuOpen(false); if (onLogout) onLogout(); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;