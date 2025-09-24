import React, { useState } from 'react';
import { BarChart3, LineChart, Map, Filter, TrendingUp, Droplet, ChevronDown } from 'lucide-react';
import TimeSeriesChart from './TimeSeriesChart';
import BarChart from './BarChart';
import SensorMap from './SensorMap';

const Analytics: React.FC = () => {
  const [activeChart, setActiveChart] = useState('timeseries');
  const [showFilters, setShowFilters] = useState(false);

  const criticalZones = [
    { zone: 'Zone 4 - Bopal', depth: '6.2m', risk: 'Critical', change: '-18%' },
    { zone: 'Zone 7 - Sarkhej', depth: '8.9m', risk: 'High', change: '-12%' },
    { zone: 'Zone 2 - Naranpura', depth: '11.3m', risk: 'Medium', change: '-8%' },
    { zone: 'Zone 9 - Gota', depth: '13.7m', risk: 'Medium', change: '-6%' },
    { zone: 'Zone 1 - Vastrapur', depth: '15.2m', risk: 'Low', change: '-3%' },
  ];

  return (
    <div className="container-responsive touch-spacing min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Groundwater Analytics
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Comprehensive analysis of groundwater patterns and trends
        </p>
      </div>

      {/* Mobile-Responsive Filters */}
      <div className="card-mobile mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full sm:hidden mb-4"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <ChevronDown 
            className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
              showFilters ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="hidden sm:flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 sm:hidden">State</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white">
                <option>Gujarat</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 sm:hidden">District</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white">
                <option>Ahmedabad District</option>
                <option>Gandhinagar District</option>
                <option>Kheda District</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 sm:hidden">From Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                defaultValue="2024-01-01"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 sm:hidden">To Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                defaultValue="2024-12-31"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 sm:hidden">Crop Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Cotton</option>
                <option>Sugarcane</option>
              </select>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <button className="btn-primary w-full mt-4 sm:mt-0">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart Selection */}
          <div className="card-mobile">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setActiveChart('timeseries')}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeChart === 'timeseries'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <LineChart className="h-4 w-4" />
                  <span>Time Series</span>
                </button>
                <button
                  onClick={() => setActiveChart('comparison')}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeChart === 'comparison'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Recharge vs Usage</span>
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden">
              {activeChart === 'timeseries' ? <TimeSeriesChart /> : <BarChart />}
            </div>
          </div>

          {/* IoT Sensor Map */}
          <div className="card-mobile">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Map className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span>Real-time IoT Sensor Data</span>
              </h3>
            </div>
            <div className="relative overflow-hidden">
              <SensorMap />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-1 space-y-6">
          {/* Top 5 Critical Zones */}
          <div className="card-mobile">
            <div className="pb-4 border-b border-gray-200 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span>Top 5 Critical Zones</span>
              </h3>
            </div>
            <div className="space-y-3">
              {criticalZones.map((zone, index) => {
                const riskColors = {
                  Critical: 'text-red-600 bg-red-100',
                  High: 'text-orange-600 bg-orange-100',
                  Medium: 'text-yellow-600 bg-yellow-100',
                  Low: 'text-green-600 bg-green-100',
                };

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-800 flex-1 min-w-0 pr-2">
                        {zone.zone}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${riskColors[zone.risk as keyof typeof riskColors]}`}
                      >
                        {zone.risk}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-1">
                        <Droplet className="h-3 w-3 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-600">{zone.depth}</span>
                      </div>
                      <span className="text-red-600 font-medium">{zone.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="card-mobile">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Total Monitoring Points</span>
                <span className="text-sm font-medium">247</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Active Sensors</span>
                <span className="text-sm font-medium text-green-600">234</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Critical Zones</span>
                <span className="text-sm font-medium text-red-600">12</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Coverage Area</span>
                <span className="text-sm font-medium">8,707 km²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;