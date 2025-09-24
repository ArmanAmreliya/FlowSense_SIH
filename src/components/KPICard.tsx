import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    red: 'from-red-500 to-pink-400',
  };

  const changeColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-4 sm:p-6`}>
        <div className="flex items-center justify-between text-white">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold">{value}</div>
            <div className="text-xs sm:text-sm opacity-90">{title}</div>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className={`flex items-center space-x-1 ${changeColor}`}>
          <TrendIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{change} from last period</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;