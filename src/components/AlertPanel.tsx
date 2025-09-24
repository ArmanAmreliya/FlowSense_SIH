import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const AlertPanel: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      icon: AlertTriangle,
      title: 'Critical Depletion in Zone 4',
      message: 'Groundwater level dropped below 8m threshold',
      time: '2 hours ago',
      action: 'Immediate action required',
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertCircle,
      title: 'Declining Trend in Zone 2',
      message: 'Continuous decline observed over 30 days',
      time: '5 hours ago',
      action: 'Monitor closely',
    },
    {
      id: 3,
      type: 'info',
      icon: Info,
      title: 'Monsoon Forecast Update',
      message: 'Above normal rainfall predicted for next month',
      time: '1 day ago',
      action: 'Prepare for increased recharge',
    },
    {
      id: 4,
      type: 'success',
      icon: CheckCircle,
      title: 'Zone 1 Recovery',
      message: 'Groundwater levels stabilized after conservation measures',
      time: '2 days ago',
      action: 'Continue monitoring',
    },
  ];

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="card-mobile h-full">
      <div className="pb-4 border-b border-gray-200 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <span>System Alerts</span>
        </h3>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`border rounded-lg p-3 sm:p-4 ${getAlertStyles(alert.type)} transition-all duration-200 hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 ${getIconColor(alert.type)}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 truncate">{alert.title}</h4>
                  <p className="text-xs mb-2 opacity-80 line-clamp-2">{alert.message}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs">
                    <span className="opacity-60">{alert.time}</span>
                    <span className="font-medium text-right sm:text-left">{alert.action}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors duration-200">
          View All Alerts
        </button>
      </div>
    </div>
  );
};

export default AlertPanel;