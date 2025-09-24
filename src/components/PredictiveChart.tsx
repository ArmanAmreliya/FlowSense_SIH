import React from 'react';

const PredictiveChart: React.FC = () => {
  const months = ['Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];
  const historical = [16.5, 15.8, null, null, null, null, null];
  const predicted = [null, null, 14.2, 12.8, 11.5, 10.2, 13.8];
  const confidence = [null, null, 1.2, 1.8, 2.1, 2.5, 2.8];

  const maxValue = 20;
  const minValue = 8;
  const chartHeight = 250;

  return (
    <div>
      <div className="relative">
        <svg width="100%" height={chartHeight + 60} className="overflow-visible">
          {/* Grid lines */}
          {[8, 10, 12, 14, 16, 18, 20].map((value) => {
            const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight + 20;
            return (
              <g key={value}>
                <line
                  x1="50"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="40"
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {value}m
                </text>
              </g>
            );
          })}

          {/* Critical threshold line */}
          <line
            x1="50"
            y1={chartHeight - ((10 - minValue) / (maxValue - minValue)) * chartHeight + 20}
            x2="100%"
            y2={chartHeight - ((10 - minValue) / (maxValue - minValue)) * chartHeight + 20}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text
            x="60"
            y={chartHeight - ((10 - minValue) / (maxValue - minValue)) * chartHeight + 15}
            className="text-xs fill-red-500 font-medium"
          >
            Critical Level (10m)
          </text>

          {/* Confidence bands */}
          {predicted.map((value, i) => {
            if (value === null || confidence[i] === null) return null;
            
            const x = 50 + (i * 600) / (months.length - 1);
            const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight + 20;
            const bandHeight = (confidence[i] / (maxValue - minValue)) * chartHeight;
            
            return (
              <rect
                key={`band-${i}`}
                x={x - 15}
                y={y - bandHeight}
                width="30"
                height={bandHeight * 2}
                fill="#a78bfa"
                fillOpacity="0.2"
                rx="4"
              />
            );
          })}

          {/* Historical line */}
          <polyline
            points={historical.map((value, i) => {
              if (value === null) return '';
              const x = 50 + (i * 600) / (months.length - 1);
              const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight + 20;
              return `${x},${y}`;
            }).filter(Boolean).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Predicted line */}
          <polyline
            points={predicted.map((value, i) => {
              if (value === null) return '';
              const x = 50 + (i * 600) / (months.length - 1);
              const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight + 20;
              return `${x},${y}`;
            }).filter(Boolean).join(' ')}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeDasharray="8,4"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {months.map((_, i) => {
            const x = 50 + (i * 600) / (months.length - 1);
            
            if (historical[i] !== null) {
              const y = chartHeight - ((historical[i] - minValue) / (maxValue - minValue)) * chartHeight + 20;
              return (
                <circle key={`hist-${i}`} cx={x} cy={y} r="5" fill="#3b82f6" className="hover:r-7 transition-all" />
              );
            }
            
            if (predicted[i] !== null) {
              const y = chartHeight - ((predicted[i] - minValue) / (maxValue - minValue)) * chartHeight + 20;
              return (
                <circle key={`pred-${i}`} cx={x} cy={y} r="5" fill="#8b5cf6" className="hover:r-7 transition-all" />
              );
            }
            
            return null;
          })}

          {/* X-axis labels */}
          {months.map((month, i) => {
            const x = 50 + (i * 600) / (months.length - 1);
            return (
              <text
                key={month}
                x={x}
                y={chartHeight + 45}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                transform={`rotate(-45, ${x}, ${chartHeight + 45})`}
              >
                {month}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center space-x-8 mt-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Historical Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-purple-500 rounded border-dashed"></div>
            <span className="text-sm text-gray-600">AI Prediction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-purple-300 bg-opacity-40 rounded"></div>
            <span className="text-sm text-gray-600">Confidence Range</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 text-sm">Critical Alert</h4>
          <p className="text-xs text-red-600 mt-1">
            Groundwater expected to reach critical levels by April 2025
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 text-sm">Recovery Expected</h4>
          <p className="text-xs text-yellow-600 mt-1">
            Monsoon season may bring 20% improvement by June
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 text-sm">Action Needed</h4>
          <p className="text-xs text-blue-600 mt-1">
            Immediate conservation measures recommended
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictiveChart;