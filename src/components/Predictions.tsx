import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';
import PredictiveChart from './PredictiveChart';
import RiskCards from './RiskCards';
import SimulationTool from './SimulationTool';

const Predictions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('forecast');

  return (
    <div className="container-responsive touch-spacing min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg flex-shrink-0">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <span>AI Predictions & Trends</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Machine learning powered forecasts and risk assessments
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="card-mobile mb-6">
        <div className="pb-4 border-b border-gray-200 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'forecast'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>6-Month Forecast</span>
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'risks'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'simulation'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Simulation</span>
            </button>
          </div>
        </div>
        
        <div className="relative">
          {activeTab === 'forecast' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>ML-Powered Depletion Forecast</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Predicted groundwater levels for the next 6 months based on current trends and weather patterns
                </p>
              </div>
              <div className="relative overflow-hidden">
                <PredictiveChart />
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Risk Assessment</span>
                </h3>
                <p className="text-sm text-gray-600">
                  AI-powered risk analysis for different zones and time periods
                </p>
              </div>
              <RiskCards />
            </div>
          )}

          {activeTab === 'simulation' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-2">
                  <Calculator className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Scenario Simulation Tool</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Explore different scenarios and their impact on groundwater resources
                </p>
              </div>
              <SimulationTool />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;