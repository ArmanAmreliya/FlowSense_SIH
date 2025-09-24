import React from 'react';

const IndiaMap: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-cyan-50 rounded-lg p-6 h-80 flex items-center justify-center">
      {/* Simplified map representation */}
      <div className="relative">
        {/* Main map area */}
        <div className="w-64 h-60 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-200 relative overflow-hidden">
          {/* Ahmedabad region zones */}
          <div className="absolute top-8 left-12 w-8 h-8 bg-green-500 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute top-16 right-16 w-6 h-6 bg-yellow-500 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-7 h-7 bg-red-500 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-5 h-5 bg-green-500 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full opacity-80 animate-pulse"></div>
          
          {/* Location marker for Ahmedabad */}
          <div className="absolute top-1/3 left-1/3 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <div className="absolute w-8 h-8 border-2 border-blue-600 rounded-full animate-ping opacity-75"></div>
          </div>
          
          {/* Label */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
            Ahmedabad District
          </div>
        </div>
        
        {/* Data points legend */}
        <div className="absolute -right-4 top-4 space-y-2">
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Zone 1</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Zone 2</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Zone 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;