import React from 'react';

const BarChart: React.FC = () => {
  const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'];
  const recharge = [85, 65, 78, 45, 92, 73];
  const usage = [72, 88, 85, 95, 78, 82];

  const maxValue = 100;
  const chartHeight = 200;

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Recharge vs Usage by Zone</h4>
      <div className="relative">
        <svg width="100%" height={chartHeight + 60} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = chartHeight - (value / maxValue) * chartHeight + 20;
            return (
              <g key={value}>
                <line
                  x1="60"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="50"
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {zones.map((zone, i) => {
            const barWidth = 40;
            const groupWidth = 600 / zones.length;
            const x = 60 + i * groupWidth + (groupWidth - barWidth * 2 - 10) / 2;

            const rechargeHeight = (recharge[i] / maxValue) * chartHeight;
            const usageHeight = (usage[i] / maxValue) * chartHeight;

            return (
              <g key={zone}>
                {/* Recharge bar */}
                <rect
                  x={x}
                  y={chartHeight - rechargeHeight + 20}
                  width={barWidth - 5}
                  height={rechargeHeight}
                  fill="#10b981"
                  className="hover:brightness-110 transition-all"
                />
                {/* Usage bar */}
                <rect
                  x={x + barWidth + 5}
                  y={chartHeight - usageHeight + 20}
                  width={barWidth - 5}
                  height={usageHeight}
                  fill="#ef4444"
                  className="hover:brightness-110 transition-all"
                />
                
                {/* Zone label */}
                <text
                  x={x + barWidth}
                  y={chartHeight + 40}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {zone}
                </text>
                
                {/* Values */}
                <text
                  x={x + (barWidth - 5) / 2}
                  y={chartHeight - rechargeHeight + 15}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {recharge[i]}%
                </text>
                <text
                  x={x + barWidth + 5 + (barWidth - 5) / 2}
                  y={chartHeight - usageHeight + 15}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {usage[i]}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Recharge Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Usage Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;