import React, { useState } from 'react';
import { Mail, Phone, LogIn, Droplet, Shield, BarChart3 } from 'lucide-react';

interface UserData {
  role: string;
  email: string;
  phone: string;
  name: string;
  loginTime: string;
}

interface LoginProps {
  onLogin: (role: string, userData: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loginType, setLoginType] = useState('email');

  const roles = [
    {
      id: 'farmer',
      label: 'Farmer',
      icon: Droplet,
      description: 'Access farming insights and irrigation recommendations',
      color: 'from-green-500 to-emerald-600',
      sample: { email: 'farmer@example.com', phone: '+91 98765 43210' }
    },
    {
      id: 'officer',
      label: 'Government Officer',
      icon: Shield,
      description: 'Monitor systems and validate alerts',
      color: 'from-blue-500 to-cyan-600',
      sample: { email: 'officer@gwrd.gov.in', phone: '+91 98765 12345' }
    },
    {
      id: 'policymaker',
      label: 'Policy Maker',
      icon: BarChart3,
      description: 'Access regional analysis and policy insights',
      color: 'from-purple-500 to-indigo-600',
      sample: { email: 'policy@gov.in', phone: '+91 98765 67890' }
    }
  ];

  const handleLogin = () => {
    const selectedRoleData = roles.find(role => role.id === selectedRole);
    const userData: UserData = {
      role: selectedRole,
      email: loginType === 'email' ? email : selectedRoleData?.sample.email || '',
      phone: loginType === 'phone' ? phone : selectedRoleData?.sample.phone || '',
      name: `Demo ${selectedRoleData?.label || 'User'}`,
      loginTime: new Date().toISOString()
    };
    
    onLogin(selectedRole, userData);
  };

  const fillSampleData = () => {
    const selectedRoleData = roles.find(role => role.id === selectedRole);
    if (selectedRoleData) {
      setEmail(selectedRoleData.sample.email);
      setPhone(selectedRoleData.sample.phone);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-2xl shadow-lg">
              <Droplet className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            FlowSense Demo
          </h1>
          <p className="text-gray-600">Groundwater Intelligence System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-xl">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="space-y-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedRole === role.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${role.color} shadow-md`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sample Data Button */}
          <div className="mb-4">
            <button
              onClick={fillSampleData}
              className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Use sample {selectedRole} credentials
            </button>
          </div>

          {/* Login Type Toggle */}
          <div className="mb-4">
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setLoginType('email')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  loginType === 'email'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setLoginType('phone')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  loginType === 'phone'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            {loginType === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loginType === 'email' ? !email : !phone}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg font-medium"
          >
            <LogIn className="h-5 w-5" />
            <span>Login as {roles.find(r => r.id === selectedRole)?.label}</span>
          </button>

          {/* Demo Notice */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Demo Mode:</strong> This is a demonstration system. No actual authentication is performed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;