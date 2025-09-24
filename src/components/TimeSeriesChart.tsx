import React from 'react';

const TimeSeriesChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data2023 = [18, 17, 16, 14, 12, 10, 15, 22, 24, 20, 19, 18];
  const data2024 = [16, 15, 14, 12, 10, 8, 13, 20, 22, 18, 17, 16];

  const maxValue = Math.max(...data2023, ...data2024);
  const chartHeight = 200;

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Groundwater Levels Over Time</h4>
      <div className="relative">
        <svg width="100%" height={chartHeight + 40} className="overflow-visible">
          {/* Grid lines */}
          {[0, 5, 10, 15, 20, 25].map((value) => {
            const y = chartHeight - (value / maxValue) * chartHeight + 20;
            return (
              <g key={value}>
                <line
                  x1="40"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="30"
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {value}m
                </text>
              </g>
            );
          })}

          {/* 2023 Line */}
          <polyline
            points={months.map((_, i) => {
              const x = 40 + (i * (100 - 40)) / (months.length - 1) + '%';
              const y = chartHeight - (data2023[i] / maxValue) * chartHeight + 20;
              return `${40 + (i * 600) / (months.length - 1)},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* 2024 Line */}
          <polyline
            points={months.map((_, i) => {
              const x = 40 + (i * (100 - 40)) / (months.length - 1) + '%';
              const y = chartHeight - (data2024[i] / maxValue) * chartHeight + 20;
              return `${40 + (i * 600) / (months.length - 1)},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {months.map((_, i) => {
            const x = 40 + (i * 600) / (months.length - 1);
            const y2023 = chartHeight - (data2023[i] / maxValue) * chartHeight + 20;
            const y2024 = chartHeight - (data2024[i] / maxValue) * chartHeight + 20;
            return (
              <g key={i}>
                <circle cx={x} cy={y2023} r="4" fill="#3b82f6" className="hover:r-6 transition-all" />
                <circle cx={x} cy={y2024} r="4" fill="#06b6d4" className="hover:r-6 transition-all" />
              </g>
            );
          })}

          {/* X-axis labels */}
          {months.map((month, i) => {
            const x = 40 + (i * 600) / (months.length - 1);
            return (
              <text
                key={month}
                x={x}
                y={chartHeight + 35}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {month}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">2023</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-cyan-500 rounded"></div>
            <span className="text-sm text-gray-600">2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;