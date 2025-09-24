import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Predictions from './components/Predictions';
import Recommendations from './components/Recommendations';
import Reports from './components/Reports';
import Profile from './components/Profile';
import Login from './components/Login';
import FarmerDashboard from './components/FarmerDashboard';
import OfficerDashboard from './components/OfficerDashboard';
import PolicyDashboard from './components/PolicyDashboard';
import { LogOut } from 'lucide-react';

interface UserData {
  role: string;
  email: string;
  phone: string;
  name: string;
  loginTime: string;
}

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (role: string, userData: UserData) => {
    setUserData(userData);
    setIsAuthenticated(true);
    
    // Role-based redirect
    switch (role) {
      case 'farmer':
        // Farmer goes directly to their dashboard
        break;
      case 'officer':
        // Officer goes directly to their dashboard
        break;
      case 'policymaker':
        // Policymaker goes directly to their dashboard
        break;
      default:
        // Default to farmer dashboard
        break;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setActiveScreen('dashboard');
  };

  const renderRoleDashboard = () => {
    if (!userData) return <Dashboard />;
    
    switch (userData.role) {
      case 'farmer':
        return <FarmerDashboard userData={userData} />;
      case 'officer':
        return <OfficerDashboard userData={userData} />;
      case 'policymaker':
        return <PolicyDashboard userData={userData} />;
      default:
        return <Dashboard />;
    }
  };

  const renderScreen = () => {
    // For role-based users, show their specific dashboard
    if (userData && ['farmer', 'officer', 'policymaker'].includes(userData.role)) {
      return renderRoleDashboard();
    }

    // Default navigation system for general users
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'predictions':
        return <Predictions />;
      case 'recommendations':
        return <Recommendations />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // For role-based users, show simplified layout with logout
  if (userData && ['farmer', 'officer', 'policymaker'].includes(userData.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple header with logout for role-based users */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-800">FlowSense Demo</h1>
              <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="w-full">
          {renderScreen()}
        </main>
      </div>
    );
  }

  // Default layout with full navigation for general users
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      
      {/* Main Content - Responsive Layout */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="w-full">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

export default App;