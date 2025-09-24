import React from 'react';
import { AlertTriangle, TrendingDown, Droplet, Thermometer } from 'lucide-react';

const RiskCards: React.FC = () => {
  const riskFactors = [
    {
      id: 1,
      title: 'Depletion Risk',
      level: 'High',
      score: 85,
      icon: TrendingDown,
      description: 'Current depletion rate exceeds sustainable levels',
      factors: ['Excessive pumping', 'Low recharge', 'Industrial usage'],
      recommendation: 'Implement immediate conservation measures',
      timeframe: 'Next 3 months',
      color: 'red',
    },
    {
      id: 2,
      title: 'Quality Degradation',
      level: 'Medium',
      score: 62,
      icon: Droplet,
      description: 'Water quality indicators show concerning trends',
      factors: ['Salinity increase', 'Contamination risk', 'pH changes'],
      recommendation: 'Enhanced monitoring and treatment protocols',
      timeframe: 'Next 6 months',
      color: 'yellow',
    },
    {
      id: 3,
      title: 'Climate Impact',
      level: 'High',
      score: 78,
      icon: Thermometer,
      description: 'Climate change affecting recharge patterns',
      factors: ['Temperature rise', 'Irregular rainfall', 'Increased evaporation'],
      recommendation: 'Develop climate-resilient water management',
      timeframe: 'Long-term',
      color: 'orange',
    },
    {
      id: 4,
      title: 'Infrastructure Risk',
      level: 'Low',
      score: 35,
      icon: AlertTriangle,
      description: 'Monitoring infrastructure is functioning well',
      factors: ['Regular maintenance', 'Modern sensors', 'Backup systems'],
      recommendation: 'Continue current maintenance schedule',
      timeframe: 'Ongoing',
      color: 'green',
    },
  ];

  const getRiskColor = (color: string) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        progress: 'bg-red-500',
        icon: 'text-red-600',
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        progress: 'bg-yellow-500',
        icon: 'text-yellow-600',
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        progress: 'bg-orange-500',
        icon: 'text-orange-600',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        progress: 'bg-green-500',
        icon: 'text-green-600',
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {riskFactors.map((risk) => {
        const Icon = risk.icon;
        const colorScheme = getRiskColor(risk.color);

        return (
          <div
            key={risk.id}
            className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg p-6 transition-all duration-200 hover:shadow-lg`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white`}>
                  <Icon className={`h-6 w-6 ${colorScheme.icon}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${colorScheme.text}`}>{risk.title}</h3>
                  <span className={`text-sm font-medium ${colorScheme.text}`}>
                    Risk Level: {risk.level}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${colorScheme.text}`}>{risk.score}</div>
                <div className="text-xs text-gray-600">Risk Score</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colorScheme.progress} transition-all duration-300`}
                  style={{ width: `${risk.score}%` }}
                ></div>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm ${colorScheme.text} mb-4`}>{risk.description}</p>

            {/* Risk Factors */}
            <div className="mb-4">
              <h4 className={`text-sm font-medium ${colorScheme.text} mb-2`}>Key Factors:</h4>
              <div className="flex flex-wrap gap-2">
                {risk.factors.map((factor, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white px-2 py-1 rounded-full text-gray-700"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="mb-3">
              <h4 className={`text-sm font-medium ${colorScheme.text} mb-1`}>Recommendation:</h4>
              <p className="text-xs text-gray-700">{risk.recommendation}</p>
            </div>

            {/* Timeframe */}
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Timeframe: {risk.timeframe}</span>
              <button className={`px-3 py-1 rounded-full text-white text-xs font-medium ${colorScheme.progress} hover:opacity-80 transition-opacity`}>
                View Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiskCards;