import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiUser, FiBell, FiShield, FiMonitor } from 'react-icons/fi';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('preferences');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load preferences from localStorage or default
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      density: 'comfortable',
      emailAlerts: true,
      marketingEmails: false
    };
  });

  // Save to localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would be an API call to save to backend
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'preferences', name: 'Preferences', icon: FiMonitor },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'account', name: 'Account Security', icon: FiShield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
          <nav className="flex flex-col space-y-1 p-4" aria-label="Settings Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-blue-600'
                      : 'text-gray-900 hover:bg-gray-100 border-transparent'
                  } border-l-4 group flex items-center px-3 py-2 text-sm font-medium transition-colors`}
                >
                  <Icon
                    className={`${
                      activeTab === tab.id ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    } flex-shrink-0 -ml-1 mr-3 h-5 w-5`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Visual Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">Customize how the application looks.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Theme</label>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <button
                      onClick={() => handleSelectChange('theme', 'light')}
                      className={`${
                        preferences.theme === 'light' ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'
                      } border rounded-md p-3 flex flex-col items-center hover:bg-gray-50`}
                    >
                      <div className="w-full h-8 bg-white border border-gray-200 rounded mb-2"></div>
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => handleSelectChange('theme', 'dark')}
                      className={`${
                        preferences.theme === 'dark' ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300'
                      } border rounded-md p-3 flex flex-col items-center hover:bg-gray-50`}
                    >
                      <div className="w-full h-8 bg-gray-900 border border-gray-700 rounded mb-2"></div>
                      <span className="text-sm font-medium">Dark (Coming Soon)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Table Density</label>
                  <p className="text-xs text-gray-500 mb-3">Adjust the spacing in data tables.</p>
                  <select
                    value={preferences.density}
                    onChange={(e) => handleSelectChange('density', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Decide how and when you'd like to be contacted.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">System Alerts</h4>
                    <p className="text-sm text-gray-500">Receive emails about low stock and system updates.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailAlerts')}
                    className={`${
                      preferences.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        preferences.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                  </button>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Marketing & News</h4>
                    <p className="text-sm text-gray-500">Receive promotional emails and product news.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketingEmails')}
                    className={`${
                      preferences.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        preferences.marketingEmails ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Security</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your password and security settings.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Password changes are currently disabled by the system administrator.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Information</h4>
                <p className="text-sm text-gray-500 mb-4">
                  To view or edit your personal information, such as your name and email address, please visit your profile page.
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiUser className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Go to Profile
                </Link>
              </div>
            </div>
          )}

          {/* Save Button Container */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-end">
            {saveSuccess && (
              <span className="text-green-600 text-sm font-medium mr-4">Settings saved successfully!</span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
