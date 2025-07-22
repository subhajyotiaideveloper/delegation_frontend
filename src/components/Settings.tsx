import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Key,
  Lock,
  Users,
  Calendar,
  Monitor,
  Moon,
  Sun,
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SettingsProps {
  onSave: (settings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const getInitialSettings = () => {
    const userEmail = localStorage.getItem('userEmail');
    const settingsKey = `settings_${userEmail}`;

    if (userEmail) {
      const local = localStorage.getItem(settingsKey);
      if (local) return JSON.parse(local);
    }
    
    // Return default settings if no user is logged in or no settings are saved
    return {
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        email: userEmail || 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        role: 'Team Lead',
        department: 'Development',
        bio: 'Experienced team lead with 5+ years in software development.',
        avatar: null,
        timezone: 'America/New_York',
        language: 'en'
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        taskAssigned: true,
        taskCompleted: true,
        taskOverdue: true,
        reminderNotifications: true,
        weeklyDigest: true,
        soundEnabled: true,
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00'
        }
      },
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginAlerts: true,
        deviceManagement: true
      },
      appearance: {
        theme: 'light',
        colorScheme: 'blue',
        fontSize: 'medium',
        compactMode: false,
        showAvatars: true,
        animationsEnabled: true
      },
      workflow: {
        defaultPriority: 'Medium',
        autoAssignTasks: false,
        requireApproval: true,
        defaultReminder: 24,
        workingHours: {
          start: '09:00',
          end: '17:00',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        taskTemplates: true,
        bulkActions: true
      },
      integrations: {
        emailIntegration: true,
        calendarSync: true,
        slackIntegration: false,
        teamsIntegration: false,
        webhooks: [],
        apiAccess: false
      },
      privacy: {
        profileVisibility: 'team',
        activityTracking: true,
        dataSharing: false,
        analyticsOptIn: true,
        cookiePreferences: 'essential'
      }
    };
  };

  const [settings, setSettings] = useState(getInitialSettings);
  
  const userEmail = localStorage.getItem('userEmail');
  const settingsKey = userEmail ? `settings_${userEmail}` : 'settings_default';

  // Re-initialize settings when user changes
  useEffect(() => {
    setSettings(getInitialSettings());
  }, [userEmail]);

  // Fetch profile from backend on mount if not in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userEmail && settingsKey !== 'settings_default' && !localStorage.getItem(settingsKey) && token) {
      fetch('https://delegation-backend.onrender.com/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setSettings((prev: any) => {
              const updated = {
                ...prev,
                profile: {
                  ...prev.profile,
                  firstName: data.first_name || '',
                  lastName: data.last_name || '',
                  email: data.email,
                  phone: data.phone || '',
                  role: data.role || '',
                  department: data.department || '',
                  bio: data.bio || '',
                }
              };
              localStorage.setItem(settingsKey, JSON.stringify(updated));
              return updated;
            });
          }
        });
    }
  }, [userEmail, settingsKey]);

  // Persist all settings changes to localStorage
  useEffect(() => {
    if (userEmail && settingsKey !== 'settings_default') {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
    }
  }, [settings, userEmail, settingsKey]);

  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev: typeof settings) => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: value
        }
      };
      return updated;
    });
  };

  const handleNestedSettingChange = (category: string, parentKey: string, key: string, value: any) => {
    setSettings((prev: typeof settings) => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [parentKey]: {
            ...(prev[category as keyof typeof prev] as any)[parentKey],
            [key]: value
          }
        }
      };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      // Save profile fields
      const profile = settings.profile;
      const profileRes = await fetch('https://delegation-backend.onrender.com/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          role: profile.role,
          department: profile.department,
          bio: profile.bio
        })
      });

      if (!profileRes.ok) throw new Error('Failed to save profile');

      // Save password if changed
      const { currentPassword, newPassword, confirmPassword } = settings.security;
      if (newPassword && newPassword === confirmPassword) {
        const passwordRes = await fetch('https://delegation-backend.onrender.com/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        if (!passwordRes.ok) {
          const err = await passwordRes.json();
          throw new Error(err.error || 'Failed to change password');
        }
      }

      onSave(settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };


  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `delegation-workflow-settings-${userEmail || 'default'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'workflow', label: 'Workflow', icon: Calendar },
    { id: 'integrations', label: 'Integrations', icon: Wifi },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
        
        {/* Avatar Upload */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={settings.profile.firstName}
              onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={settings.profile.lastName}
              onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={settings.profile.role}
              onChange={(e) => handleSettingChange('profile', 'role', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Team Lead">Team Lead</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="QA">QA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={settings.profile.department}
              onChange={(e) => handleSettingChange('profile', 'department', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={settings.profile.bio}
            onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive notifications via email</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Push Notifications</div>
                <div className="text-sm text-gray-500">Receive browser push notifications</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">SMS Notifications</div>
                <div className="text-sm text-gray-500">Receive text message notifications</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Notification Types</h4>
        <div className="space-y-3">
          {[
            { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a task is assigned to you' },
            { key: 'taskCompleted', label: 'Task Completed', desc: 'When someone completes a task you assigned' },
            { key: 'taskOverdue', label: 'Task Overdue', desc: 'When tasks become overdue' },
            { key: 'reminderNotifications', label: 'Reminders', desc: 'Task reminder notifications' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your tasks' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Quiet Hours</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-900">Enable Quiet Hours</span>
            <input
              type="checkbox"
              checked={settings.notifications.quietHours.enabled}
              onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          {settings.notifications.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.notifications.quietHours.start}
                  onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'start', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.notifications.quietHours.end}
                  onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'end', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Password & Security</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.security.currentPassword}
                onChange={(e) => handleSettingChange('security', 'currentPassword', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={settings.security.newPassword}
              onChange={(e) => handleSettingChange('security', 'newPassword', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={settings.security.confirmPassword}
              onChange={(e) => handleSettingChange('security', 'confirmPassword', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable 2FA</div>
              <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
            </div>
            <button
              onClick={() => handleSettingChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                settings.security.twoFactorEnabled 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Session Management</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Login Alerts</div>
              <div className="text-sm text-gray-500">Get notified of new login attempts</div>
            </div>
            <input
              type="checkbox"
              checked={settings.security.loginAlerts}
              onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme & Display</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('appearance', 'theme', theme.value)}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      settings.appearance.theme === theme.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm font-medium text-gray-900">{theme.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'blue', color: 'bg-blue-500' },
                { value: 'green', color: 'bg-green-500' },
                { value: 'purple', color: 'bg-purple-500' },
                { value: 'red', color: 'bg-red-500' }
              ].map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => handleSettingChange('appearance', 'colorScheme', scheme.value)}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    settings.appearance.colorScheme === scheme.value
                      ? 'border-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 ${scheme.color} rounded-full mx-auto`}></div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={settings.appearance.fontSize}
              onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and padding' },
              { key: 'showAvatars', label: 'Show Avatars', desc: 'Display user avatars throughout the app' },
              { key: 'animationsEnabled', label: 'Enable Animations', desc: 'Show smooth transitions and effects' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance[item.key as keyof typeof settings.appearance] as boolean}
                  onChange={(e) => handleSettingChange('appearance', item.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Priority</label>
            <select
              value={settings.workflow.defaultPriority}
              onChange={(e) => handleSettingChange('workflow', 'defaultPriority', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Reminder (hours before)</label>
            <select
              value={settings.workflow.defaultReminder}
              onChange={(e) => handleSettingChange('workflow', 'defaultReminder', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 hour</option>
              <option value={4}>4 hours</option>
              <option value={24}>1 day</option>
              <option value={48}>2 days</option>
              <option value={168}>1 week</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { key: 'autoAssignTasks', label: 'Auto-assign Tasks', desc: 'Automatically assign tasks based on workload' },
              { key: 'requireApproval', label: 'Require Approval', desc: 'Tasks need approval before completion' },
              { key: 'taskTemplates', label: 'Enable Task Templates', desc: 'Use predefined task templates' },
              { key: 'bulkActions', label: 'Enable Bulk Actions', desc: 'Allow bulk operations on multiple tasks' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.workflow[item.key as keyof typeof settings.workflow] as boolean}
                  onChange={(e) => handleSettingChange('workflow', item.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Working Hours</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={settings.workflow.workingHours.start}
                onChange={(e) => handleNestedSettingChange('workflow', 'workingHours', 'start', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={settings.workflow.workingHours.end}
                onChange={(e) => handleNestedSettingChange('workflow', 'workingHours', 'end', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <div className="grid grid-cols-7 gap-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <label key={day} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={settings.workflow.workingHours.workingDays.includes(day)}
                    onChange={(e) => {
                      const workingDays = e.target.checked
                        ? [...settings.workflow.workingHours.workingDays, day]
                        : settings.workflow.workingHours.workingDays.filter((d: string) => d !== day);
                      handleNestedSettingChange('workflow', 'workingHours', 'workingDays', workingDays);
                    }}
                    className="w-3 h-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-700 capitalize">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailIntegration', label: 'Email Integration', desc: 'Sync with your email client', icon: Mail },
            { key: 'calendarSync', label: 'Calendar Sync', desc: 'Sync tasks with your calendar', icon: Calendar },
            { key: 'slackIntegration', label: 'Slack Integration', desc: 'Send notifications to Slack', icon: Activity },
            { key: 'teamsIntegration', label: 'Microsoft Teams', desc: 'Connect with Teams channels', icon: Users },
            { key: 'apiAccess', label: 'API Access', desc: 'Enable API access for third-party apps', icon: Key }
          ].map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{integration.label}</div>
                    <div className="text-sm text-gray-500">{integration.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingChange('integrations', integration.key, !settings.integrations[integration.key as keyof typeof settings.integrations])}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.integrations[integration.key as keyof typeof settings.integrations]
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {settings.integrations[integration.key as keyof typeof settings.integrations] ? 'Connected' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Webhooks</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Configure webhooks for external integrations</span>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Add Webhook
            </button>
          </div>
          <div className="text-sm text-gray-500">No webhooks configured</div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Data</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="team">Team Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cookie Preferences</label>
            <select
              value={settings.privacy.cookiePreferences}
              onChange={(e) => handleSettingChange('privacy', 'cookiePreferences', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="essential">Essential Only</option>
              <option value="functional">Essential + Functional</option>
              <option value="all">All Cookies</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { key: 'activityTracking', label: 'Activity Tracking', desc: 'Track your activity for analytics' },
              { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for improvements' },
              { key: 'analyticsOptIn', label: 'Analytics', desc: 'Help improve the app with usage analytics' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                  onChange={(e) => handleSettingChange('privacy', item.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Data Management</h4>
        <div className="space-y-3">
          <button className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download My Data
          </button>
          <button 
            onClick={handleExportSettings}
            className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Settings
          </button>
          <button className="w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      case 'workflow': return renderWorkflowSettings();
      case 'integrations': return renderIntegrationsSettings();
      case 'privacy': return renderPrivacySettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportSettings}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                saveStatus === 'saving'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saveStatus === 'saving' && <RefreshCw className="w-4 h-4 animate-spin" />}
              {saveStatus === 'saved' && <CheckCircle className="w-4 h-4" />}
              {saveStatus === 'error' && <AlertTriangle className="w-4 h-4" />}
              {saveStatus === 'idle' && <Save className="w-4 h-4" />}
              {saveStatus === 'saving' ? 'Saving...' : 
               saveStatus === 'saved' ? 'Saved!' : 
               saveStatus === 'error' ? 'Error' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;