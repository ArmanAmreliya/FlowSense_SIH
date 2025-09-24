import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Database, HelpCircle, LogOut, Edit3, Save, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = {
    name: 'Dr. Rajesh Kumar',
    role: 'Senior Hydrogeologist',
    organization: 'Gujarat Water Resources Department',
    email: 'rajesh.kumar@gwrd.gov.in',
    phone: '+91 98765 43210',
    location: 'Ahmedabad, Gujarat',
    joinDate: 'January 2020',
    lastLogin: '2024-01-15 14:30 IST',
  };

  const navigationItems = [
    { id: 'profile', icon: User, label: 'Profile Information' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'data', icon: Database, label: 'Data Preferences' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="container-responsive touch-spacing min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg flex-shrink-0">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <span>Profile & Settings</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your account settings and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Navigation - Mobile Tabs / Desktop Sidebar */}
        <div className="xl:col-span-1">
          <div className="card-mobile">
            {/* Mobile Tab Navigation */}
            <div className="xl:hidden mb-4">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              >
                {navigationItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Desktop Sidebar Navigation */}
            <nav className="hidden xl:block space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Logout Button */}
              <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 hover:bg-red-50 text-red-600 mt-6 border-t border-gray-200 pt-6">
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3">
          {activeTab === 'profile' && (
            <div className="card-mobile">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary mt-4 sm:mt-0"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-semibold text-gray-800">{userInfo.name}</h4>
                  <p className="text-gray-600">{userInfo.role}</p>
                  <p className="text-sm text-gray-500">{userInfo.organization}</p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={userInfo.name}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border border-gray-300 rounded-lg text-sm ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    defaultValue={userInfo.role}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border border-gray-300 rounded-lg text-sm ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue={userInfo.email}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border border-gray-300 rounded-lg text-sm ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    defaultValue={userInfo.phone}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border border-gray-300 rounded-lg text-sm ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <input
                    type="text"
                    defaultValue={userInfo.organization}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border border-gray-300 rounded-lg text-sm ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    defaultValue={userInfo.location}
                    disabled={!isEditing}
                    className={`w-full px-3 py-3 border border-gray-300 rounded-lg text-sm ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400 focus:border-transparent' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium">{userInfo.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-medium">{userInfo.lastLogin}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card-mobile">
              <div className="pb-4 border-b border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
                <p className="text-sm text-gray-600 mt-1">Choose how you want to receive notifications</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Email Notifications</h4>
                  {[
                    { label: 'Critical water level alerts', desc: 'Immediate notifications for emergency situations' },
                    { label: 'Weekly monitoring reports', desc: 'Summary of groundwater status and trends' },
                    { label: 'Monthly analysis reports', desc: 'Detailed analysis and recommendations' },
                    { label: 'System maintenance updates', desc: 'Notifications about system downtime and updates' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{item.label}</div>
                        <div className="text-xs text-gray-600">{item.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                  {[
                    { label: 'Emergency alerts only', desc: 'Critical situations requiring immediate action' },
                    { label: 'Daily summary', desc: 'Brief daily status updates' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{item.label}</div>
                        <div className="text-xs text-gray-600">{item.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked={index === 0} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card-mobile">
              <div className="pb-4 border-b border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your account security and privacy</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Password</h4>
                  <button className="btn-secondary">
                    Change Password
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">Enable 2FA</div>
                      <div className="text-xs text-gray-600">Add an extra layer of security to your account</div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Login Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">Current Session - Chrome on Windows</div>
                        <div className="text-xs text-gray-600">Active now</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would go here with similar responsive structure */}
          {activeTab !== 'profile' && activeTab !== 'notifications' && activeTab !== 'security' && (
            <div className="card-mobile">
              <div className="pb-4 border-b border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">{activeTab}</h3>
                <p className="text-sm text-gray-600 mt-1">Settings for {activeTab} will be displayed here</p>
              </div>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">This section is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Logout Button */}
      <div className="xl:hidden mt-6">
        <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;