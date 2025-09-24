import React, { useState } from 'react';
import { Users, Building, Crown, Bell, Smartphone, Mail, Wheat, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Recommendations: React.FC = () => {
  const [activeRole, setActiveRole] = useState('farmers');

  const roleData = {
    farmers: {
      icon: Wheat,
      title: 'Farmers',
      color: 'green',
      recommendations: [
        {
          id: 1,
          title: 'Reduce Irrigation by 30% This Week',
          priority: 'High',
          description: 'Groundwater levels in your area have dropped significantly. Switch to drip irrigation and water crops during cooler hours.',
          action: 'Implement immediately',
          impact: 'Save 2,000L water/day',
          deadline: '3 days',
        },
        {
          id: 2,
          title: 'Switch to Drought-Resistant Crops',
          priority: 'Medium',
          description: 'Consider planting millets or pulses which require 40% less water than traditional crops.',
          action: 'Plan for next season',
          impact: 'Reduce water usage by 40%',
          deadline: '2 months',
        },
      ],
    },
    policymakers: {
      icon: Crown,
      title: 'Policymakers',
      color: 'purple',
      recommendations: [
        {
          id: 1,
          title: 'Implement Emergency Water Rationing',
          priority: 'Critical',
          description: 'Critical zones require immediate intervention. Implement structured water allocation policies.',
          action: 'Draft emergency regulations',
          impact: 'Protect 12 critical zones',
          deadline: '1 week',
        },
      ],
    },
    industry: {
      icon: Building,
      title: 'Industry',
      color: 'blue',
      recommendations: [
        {
          id: 1,
          title: 'Mandatory Water Recycling',
          priority: 'High',
          description: 'Implement closed-loop water systems to reduce groundwater dependency.',
          action: 'Install recycling equipment',
          impact: 'Reduce water intake by 60%',
          deadline: '3 months',
        },
      ],
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return AlertTriangle;
      case 'Medium':
        return Clock;
      case 'Low':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="container-responsive touch-spacing min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg flex-shrink-0">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <span>Recommendations & Alerts</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Personalized recommendations for different stakeholders
        </p>
      </div>

      {/* Role Selection */}
      <div className="card-mobile mb-6">
        <div className="pb-4 border-b border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Role</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(roleData).map(([roleKey, role]) => {
              const IconComponent = role.icon;
              const colorClasses = {
                green: 'from-green-500 to-emerald-500',
                purple: 'from-purple-500 to-pink-500',
                blue: 'from-blue-500 to-cyan-500',
              };

              return (
                <button
                  key={roleKey}
                  onClick={() => setActiveRole(roleKey)}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeRole === roleKey
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className={`bg-gradient-to-r ${colorClasses[role.color as keyof typeof colorClasses]} p-2 rounded-lg flex-shrink-0`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{role.title}</div>
                    <div className="text-xs text-gray-600">
                      {role.recommendations.length} recommendations
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendations for Selected Role */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <span>Recommendations for {roleData[activeRole as keyof typeof roleData].title}</span>
          </h3>

          <div className="space-y-4">
            {roleData[activeRole as keyof typeof roleData].recommendations.map((rec) => {
              const PriorityIcon = getPriorityIcon(rec.priority);

              return (
                <div
                  key={rec.id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3 mb-3">
                        <PriorityIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 mb-1">{rec.title}</h4>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              rec.priority
                            )}`}
                          >
                            {rec.priority} Priority
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-700">Next Action</div>
                      <div className="text-gray-600">{rec.action}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-700">Expected Impact</div>
                      <div className="text-green-600 font-medium">{rec.impact}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-700">Deadline</div>
                      <div className="text-orange-600 font-medium">{rec.deadline}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button className="btn-primary flex-1">Mark as Implemented</button>
                    <button className="btn-secondary">Get More Info</button>
                    <button className="btn-secondary">
                      <Mail className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
