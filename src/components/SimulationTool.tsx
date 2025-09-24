import React, { useState } from 'react';
import { Play, RotateCcw, TrendingDown, TrendingUp } from 'lucide-react';

const SimulationTool: React.FC = () => {
  const [scenario, setScenario] = useState({
    rainfall: 0,
    temperature: 0,
    pumping: 0,
    conservation: 0,
  });
  
  const [results, setResults] = useState({
    depletionRate: -15,
    rechargeRate: 68,
    criticalZones: 12,
    timeToRecovery: '18 months',
  });

  const runSimulation = () => {
    // Simulate the impact of different scenarios
    const rainfallImpact = scenario.rainfall * 0.3;
    const tempImpact = scenario.temperature * -0.2;
    const pumpingImpact = scenario.pumping * -0.4;
    const conservationImpact = scenario.conservation * 0.5;

    const totalImpact = rainfallImpact + tempImpact + pumpingImpact + conservationImpact;

    setResults({
      depletionRate: Math.max(-50, Math.min(10, -15 - totalImpact)),
      rechargeRate: Math.max(20, Math.min(100, 68 + totalImpact)),
      criticalZones: Math.max(0, Math.min(25, Math.round(12 - totalImpact / 3))),
      timeToRecovery: totalImpact > 0 ? '12 months' : totalImpact < -10 ? '36 months' : '18 months',
    });
  };

  const resetScenario = () => {
    setScenario({ rainfall: 0, temperature: 0, pumping: 0, conservation: 0 });
    setResults({
      depletionRate: -15,
      rechargeRate: 68,
      criticalZones: 12,
      timeToRecovery: '18 months',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Controls */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-800">Scenario Parameters</h4>
        
        {/* Rainfall Change */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Rainfall Change: {scenario.rainfall > 0 ? '+' : ''}{scenario.rainfall}%
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            value={scenario.rainfall}
            onChange={(e) => setScenario({ ...scenario, rainfall: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-50% (Severe Drought)</span>
            <span>+50% (Excess Rain)</span>
          </div>
        </div>

        {/* Temperature Change */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Temperature Change: {scenario.temperature > 0 ? '+' : ''}{scenario.temperature}°C
          </label>
          <input
            type="range"
            min="-5"
            max="10"
            value={scenario.temperature}
            onChange={(e) => setScenario({ ...scenario, temperature: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-5°C (Cooler)</span>
            <span>+10°C (Hotter)</span>
          </div>
        </div>

        {/* Pumping Change */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Pumping Rate Change: {scenario.pumping > 0 ? '+' : ''}{scenario.pumping}%
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            value={scenario.pumping}
            onChange={(e) => setScenario({ ...scenario, pumping: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-30% (Reduced)</span>
            <span>+30% (Increased)</span>
          </div>
        </div>

        {/* Conservation Measures */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Conservation Measures: {scenario.conservation}% Implementation
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={scenario.conservation}
            onChange={(e) => setScenario({ ...scenario, conservation: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0% (No Measures)</span>
            <span>100% (Full Implementation)</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={runSimulation}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Play className="h-4 w-4" />
            <span>Run Simulation</span>
          </button>
          <button
            onClick={resetScenario}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-800">Predicted Impact</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Depletion Rate */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-800">Depletion Rate</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-800">{results.depletionRate}%</div>
            <div className="text-xs text-red-600">
              {results.depletionRate > -10 ? 'Improved' : results.depletionRate < -20 ? 'Worsened' : 'Stable'}
            </div>
          </div>

          {/* Recharge Rate */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Recharge Rate</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-800">{results.rechargeRate}%</div>
            <div className="text-xs text-blue-600">
              {results.rechargeRate > 75 ? 'Excellent' : results.rechargeRate > 50 ? 'Good' : 'Poor'}
            </div>
          </div>

          {/* Critical Zones */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">Critical Zones</span>
            </div>
            <div className="text-2xl font-bold text-yellow-800">{results.criticalZones}</div>
            <div className="text-xs text-yellow-600">
              {results.criticalZones < 8 ? 'Improved' : results.criticalZones > 15 ? 'Worsened' : 'Stable'}
            </div>
          </div>

          {/* Recovery Time */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Recovery Time</span>
            </div>
            <div className="text-xl font-bold text-green-800">{results.timeToRecovery}</div>
            <div className="text-xs text-green-600">Estimated timeline</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-3">Scenario Recommendations</h5>
          <div className="space-y-2 text-sm text-gray-600">
            {results.depletionRate < -20 && (
              <div className="flex items-start space-x-2">
                <span className="text-red-500">•</span>
                <span>Immediate intervention required - depletion rate too high</span>
              </div>
            )}
            {results.rechargeRate < 50 && (
              <div className="flex items-start space-x-2">
                <span className="text-yellow-500">•</span>
                <span>Enhance recharge through artificial groundwater recharge systems</span>
              </div>
            )}
            {results.criticalZones > 15 && (
              <div className="flex items-start space-x-2">
                <span className="text-red-500">•</span>
                <span>Focus conservation efforts on critical zones</span>
              </div>
            )}
            {scenario.conservation > 70 && (
              <div className="flex items-start space-x-2">
                <span className="text-green-500">•</span>
                <span>High conservation measures show positive impact</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTool;