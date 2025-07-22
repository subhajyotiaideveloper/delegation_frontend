import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Plus, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create', label: 'Create Task', icon: Plus },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'my-tasks', label: 'My Tasks', icon: CheckCircle },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const [stats, setStats] = useState({
    totalDelegations: 0,
    completedDelegations: 0,
    pendingDelegations: 0,
    overdueDelegations: 0
  });

  useEffect(() => {
    fetch('https://delegation-backend.onrender.com/analytics')
      .then(res => res.json())
      .then(data => setStats({
        totalDelegations: data.totalDelegations,
        completedDelegations: data.completedDelegations,
        pendingDelegations: data.pendingDelegations,
        overdueDelegations: data.overdueDelegations
      }));
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeView === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 px-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Tasks</span>
                <span className="font-medium text-gray-900">{stats.totalDelegations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{stats.completedDelegations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">{stats.pendingDelegations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overdue</span>
                <span className="font-medium text-red-600">{stats.overdueDelegations}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;