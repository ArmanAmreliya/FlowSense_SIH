import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  User,
  Droplet,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeScreen, setActiveScreen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: Waves, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Groundwater Analytics' },
    { id: 'predictions', icon: TrendingUp, label: 'Predictions & Trends' },
    { id: 'recommendations', icon: AlertTriangle, label: 'Recommendations & Alerts' },
    { id: 'reports', icon: FileText, label: 'Reports & Export' },
    { id: 'profile', icon: User, label: 'Profile & Settings' },
  ];

  // Close mobile menu when screen changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeScreen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavItemClick = (screenId: string) => {
    setActiveScreen(screenId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg z-50 pt-safe">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-400 rounded-lg p-2">
              <Droplet className="h-6 w-6 text-blue-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold">FlowSence</h1>
              <p className="text-xs text-blue-200">AI Groundwater Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="nav-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <nav 
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl z-50 pt-safe transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Navigation Header */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-400 rounded-lg p-2">
              <Droplet className="h-8 w-8 text-blue-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FlowSence</h1>
              <p className="text-sm text-blue-200">AI Groundwater Intelligence</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Items */}
        <div className="p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-left transition-all duration-200 ${
                  activeScreen === item.id
                    ? 'bg-cyan-400 text-blue-900 font-semibold shadow-lg'
                    : 'hover:bg-blue-700 hover:translate-x-1'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 pb-safe">
          <div className="flex items-center justify-center space-x-2 text-xs text-blue-200">
            <span>Powered by</span>
            <span className="font-semibold text-cyan-400">Jal Shakti Ministry</span>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl z-50">
        {/* Desktop Header */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-400 rounded-lg p-2">
              <Droplet className="h-8 w-8 text-blue-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FlowSence</h1>
              <p className="text-sm text-blue-200">AI Groundwater Intelligence</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeScreen === item.id
                    ? 'bg-cyan-400 text-blue-900 font-semibold shadow-lg'
                    : 'hover:bg-blue-700 hover:translate-x-1'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="flex items-center justify-center space-x-2 text-xs text-blue-200">
            <span>Powered by</span>
            <span className="font-semibold text-cyan-400">Jal Shakti Ministry</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;