import { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import DelegationForm from './components/DelegationForm';
import DelegationDashboard from './components/DelegationDashboard';
import DelegationDetail from './components/DelegationDetail';
import Calendar from './components/Calendar';
import Team from './components/Team';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import { Delegation, DelegationFormData } from './types/delegation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [showRegister, setShowRegister] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  // Fetch user profile
  useEffect(() => {
    if (token && userEmail) {
      fetch('https://delegation-backend.onrender.com/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setUserProfile({
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email
            });
          }
        })
        .catch(() => setUserProfile(null));
    }
  }, [token, userEmail]);

  // Fetch delegations from backend on mount or when token changes
  useEffect(() => {
    if (token) {
      fetch('https://delegation-backend.onrender.com/delegations', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => setDelegations(data))
        .catch(() => setDelegations([]));
    }
  }, [token]);

  const handleCreateDelegation = async (formData: DelegationFormData) => {
    // Map formData to backend expected fields
    const payload = {
      ...formData,
      assignedBy: userEmail, // Replace with real user email
      assignedTo: formData.assignedTo,
      status: 'Pending',
    };
    try {
      const res = await fetch('https://delegation-backend.onrender.com/delegations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const newDelegation = await res.json();
      setDelegations(prev => [newDelegation, ...prev]);
      setActiveView('dashboard');
    } catch (err) {
      // handle error
    }
  };

  const handleEditDelegation = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
    setActiveView('edit');
  };

  const handleDeleteDelegation = async (id: string) => {
    try {
      await fetch(`https://delegation-backend.onrender.com/delegations/${id}`, { method: 'DELETE' });
      setDelegations(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      // handle error
    }
  };

  const handleViewDelegation = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const delegation = delegations.find(d => d.id === id);
    if (!delegation) return;
    const updated = {
      ...delegation,
      status: status as 'Pending' | 'In Progress' | 'Completed' | 'Overdue',
      completedAt: status === 'Completed' ? new Date().toISOString() : delegation.completedAt,
      assignedBy: delegation.assignedBy,
      assignedTo: delegation.assignedTo,
      notifyTo: delegation.notifyTo,
      auditor: delegation.auditor,
      taskName: delegation.taskName || '',
      plannedDate: delegation.plannedDate || null,
      priority: delegation.priority || 'Medium',
      message: delegation.message || '',
      attachments: delegation.attachments,
      assignedPC: delegation.assignedPC || null,
      groupName: delegation.groupName || null,
      makeAttachmentMandatory: !!delegation.makeAttachmentMandatory,
      makeNoteMandatory: !!delegation.makeNoteMandatory,
      notifyDoer: delegation.notifyDoer || '',
      setReminder: !!delegation.setReminder,
      reminderMode: delegation.reminderMode || null,
      reminderFrequency: delegation.reminderFrequency || null,
      reminderBeforeDays: delegation.reminderBeforeDays || null,
      reminderStartingTime: delegation.reminderStartingTime || null,
      notes: delegation.notes || '',
    };
    try {
      await fetch(`https://delegation-backend.onrender.com/delegations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setDelegations(prev => prev.map(d => d.id === id ? updated as Delegation : d));
    } catch (err) {
      // handle error
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    // Reload to ensure all user-specific data is fetched correctly
    window.location.reload();
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
    // Here you would typically save to your backend
  };

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <DelegationForm
            onSubmit={handleCreateDelegation}
            onCancel={() => setActiveView('dashboard')}
          />
        );
      case 'dashboard':
        return (
          <DelegationDashboard
            delegations={delegations}
            onEditDelegation={handleEditDelegation}
            onDeleteDelegation={handleDeleteDelegation}
            onViewDelegation={handleViewDelegation}
          />
        );
      case 'calendar':
        return (
          <Calendar
            delegations={delegations}
            onCreateTask={() => setActiveView('create')}
            onTaskClick={handleViewDelegation}
          />
        );
      case 'team':
        return (
          <Team
            onAddMember={() => setActiveView('create')}
          />
        );
      case 'settings':
        return (
          <Settings
            onSave={handleSaveSettings}
          />
        );
      case 'my-tasks':
        return (
          <DelegationDashboard
            delegations={delegations.filter(d => (typeof d.assignedTo === 'object' && d.assignedTo && d.assignedTo.email === userEmail))}
            onEditDelegation={handleEditDelegation}
            onDeleteDelegation={handleDeleteDelegation}
            onViewDelegation={handleViewDelegation}
          />
        );
      case 'overdue':
        return (
          <DelegationDashboard
            delegations={delegations.filter(d => d.status === 'Overdue')}
            onEditDelegation={handleEditDelegation}
            onDeleteDelegation={handleDeleteDelegation}
            onViewDelegation={handleViewDelegation}
          />
        );
      case 'pending':
        return (
          <DelegationDashboard
            delegations={delegations.filter(d => d.status === 'Pending')}
            onEditDelegation={handleEditDelegation}
            onDeleteDelegation={handleDeleteDelegation}
            onViewDelegation={handleViewDelegation}
          />
        );
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            setShowRegister(false);
          }}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    } else {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      );
    }
  }

  return (
    <>
      <Header 
        userProfile={userProfile}
        onMenuToggle={handleMenuToggle}
        onViewChange={setActiveView}
        onLogout={() => {
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
        }}
      />
      
      <div className="flex">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isOpen={isMobileMenuOpen}
          onClose={handleSidebarClose}
        />
        <main className="flex-1 bg-gray-50 min-h-screen">
          {renderContent()}
        </main>
      </div>

      {selectedDelegation && (
        <DelegationDetail
          delegation={selectedDelegation}
          onClose={() => setSelectedDelegation(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}

export default App;