import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, MapIcon, Users, TrendingUp, FileText, MapPin, Layers, Filter,
  Search, Home, User, ChevronDown, Bell, Download, Target, AlertTriangle,
  Calendar, Droplets, Globe, Activity, Zap, Shield, Eye, CheckCircle,
  Navigation, Satellite, RefreshCw, Settings, Clock, PieChart
} from 'lucide-react';

// OpenLayers imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

interface PolicyDashboardProps {
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
}

const PolicyDashboard: React.FC<PolicyDashboardProps> = ({
  userData = { name: 'Policy Maker', email: 'policy@flowsence.gov.in', phone: '+91-9876543210' }
}) => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1year');
  const [selectedAquifer, setSelectedAquifer] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [mapLayers, setMapLayers] = useState({
    depletion: true,
    recharge: false,
    extraction: false,
    forecast: false
  });

  // Effect for mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced data with policy focus
  const nationalKPIs = React.useMemo(() => ({
    safeZones: { value: 52, unit: '%', trend: -3.2, status: 'warning', target: 60 },
    criticalZones: { value: 18, unit: '%', trend: +2.1, status: 'critical', target: 10 },
    rechargeRate: { value: 65, unit: '%', trend: +4.5, status: 'good', target: 70 },
    policyImpact: { value: 28, unit: '%', trend: +12.8, status: 'excellent', target: 30 }
  }), []);

  const heatmapRegions = React.useMemo(() => [
    {
      id: 1,
      name: 'North India',
      coordinates: [77.2090, 28.6139],
      category: 'critical',
      depletion: 82,
      recharge: 35,
      extraction: 145,
      forecast: 95,
      population: '350M',
      states: ['Punjab', 'Haryana', 'Rajasthan'],
      trend: 'declining',
      riskLevel: 'high'
    },
    {
      id: 2,
      name: 'West India',
      coordinates: [72.8777, 19.0760],
      category: 'semi-critical',
      depletion: 68,
      recharge: 52,
      extraction: 120,
      forecast: 78,
      population: '280M',
      states: ['Gujarat', 'Maharashtra', 'Goa'],
      trend: 'stable',
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: 'South India',
      coordinates: [78.4867, 17.3850],
      category: 'safe',
      depletion: 45,
      recharge: 78,
      extraction: 85,
      forecast: 52,
      population: '265M',
      states: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
      trend: 'improving',
      riskLevel: 'low'
    },
    {
      id: 4,
      name: 'East India',
      coordinates: [88.3639, 22.5726],
      category: 'safe',
      depletion: 38,
      recharge: 85,
      extraction: 72,
      forecast: 42,
      population: '310M',
      states: ['West Bengal', 'Odisha', 'Jharkhand'],
      trend: 'stable',
      riskLevel: 'low'
    },
    {
      id: 5,
      name: 'Central India',
      coordinates: [78.6569, 22.9734],
      category: 'moderate',
      depletion: 58,
      recharge: 62,
      extraction: 95,
      forecast: 65,
      population: '180M',
      states: ['Madhya Pradesh', 'Chhattisgarh'],
      trend: 'declining',
      riskLevel: 'medium'
    }
  ], []);

  const aiRecommendations = React.useMemo(() => [
    {
      id: 1,
      title: 'National Water Security Act 2025',
      priority: 'Critical',
      impact: 'Pan-India',
      category: 'Legislative',
      description: 'Implement comprehensive groundwater management framework with mandatory water budgeting',
      recommendation: 'Draft legislation for mandatory groundwater impact assessments for all development projects',
      timeline: '6-12 months',
      budgetImpact: '₹15,000 Cr',
      expectedSavings: '12% water conservation',
      aiConfidence: '92%',
      ministries: ['Jal Shakti', 'Environment', 'Agriculture']
    },
    {
      id: 2,
      title: 'AI-Powered Early Warning System',
      priority: 'High',
      impact: 'Critical States',
      category: 'Technology',
      description: 'Deploy nationwide groundwater monitoring network with predictive analytics',
      recommendation: 'Install 50,000 smart sensors with real-time monitoring capabilities',
      timeline: '18-24 months',
      budgetImpact: '₹8,500 Cr',
      expectedSavings: '25% reduction in water stress',
      aiConfidence: '87%',
      ministries: ['Jal Shakti', 'IT & Electronics']
    },
    {
      id: 3,
      title: 'Micro-Irrigation Mission 2025',
      priority: 'High',
      impact: 'Agricultural States',
      category: 'Infrastructure',
      description: 'Scale up precision irrigation to 50M hectares with smart water management',
      recommendation: 'Subsidize 80% of smart irrigation costs for small & marginal farmers',
      timeline: '3-5 years',
      budgetImpact: '₹25,000 Cr',
      expectedSavings: '40% irrigation water savings',
      aiConfidence: '89%',
      ministries: ['Agriculture', 'Jal Shakti', 'Rural Development']
    }
  ], []);

  const forecastData = React.useMemo(() => ({
    fiveYear: {
      safeZones: [52, 48, 45, 42, 38],
      criticalZones: [18, 22, 26, 30, 35],
      rechargeRate: [65, 62, 58, 55, 51]
    },
    tenYear: {
      safeZones: [52, 48, 45, 42, 38, 35, 32, 28, 25, 22],
      criticalZones: [18, 22, 26, 30, 35, 40, 45, 50, 55, 60],
      rechargeRate: [65, 62, 58, 55, 51, 47, 43, 39, 35, 31]
    }
  }), []);

  // KPI Cards Component
  const KPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{nationalKPIs.safeZones.value}%</div>
            <div className="text-sm text-gray-600">Safe Zones</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${nationalKPIs.safeZones.trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm font-medium">{Math.abs(nationalKPIs.safeZones.trend)}%</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Target: {nationalKPIs.safeZones.target}%
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{nationalKPIs.criticalZones.value}%</div>
            <div className="text-sm text-gray-600">Critical Zones</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${nationalKPIs.criticalZones.trend > 0 ? 'text-red-600' : 'text-green-600'}`} />
            <span className="text-sm font-medium">{Math.abs(nationalKPIs.criticalZones.trend)}%</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
            Target: {nationalKPIs.criticalZones.target}%
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{nationalKPIs.rechargeRate.value}%</div>
            <div className="text-sm text-gray-600">Recharge Rate</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${nationalKPIs.rechargeRate.trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm font-medium">{Math.abs(nationalKPIs.rechargeRate.trend)}%</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            Target: {nationalKPIs.rechargeRate.target}%
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{nationalKPIs.policyImpact.value}%</div>
            <div className="text-sm text-gray-600">Policy Impact</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${nationalKPIs.policyImpact.trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm font-medium">{Math.abs(nationalKPIs.policyImpact.trend)}%</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            Target: {nationalKPIs.policyImpact.target}%
          </span>
        </div>
      </div>
    </div>
  );

  // Heatmap View Component
  const HeatmapView = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const olMapRef = useRef<Map | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [selectedRegion, setSelectedRegion] = useState<typeof heatmapRegions[0] | null>(null);
    const [currentMapLayer, setCurrentMapLayer] = useState('satellite');
    const [activeHeatmapLayer, setActiveHeatmapLayer] = useState('depletion');

    useEffect(() => {
      if (!mapRef.current || olMapRef.current) return;

      // Create tooltip overlay
      const tooltip = new Overlay({
        element: tooltipRef.current!,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10]
      });

      // Create different tile layers
      const satelliteLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: '© Esri'
        })
      });

      const terrainLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attributions: '© Esri'
        })
      });

      const streetLayer = new TileLayer({
        source: new OSM()
      });

      // Create vector source for heatmap regions
      const vectorSource = new VectorSource();

      // Add region features with heatmap styling
      heatmapRegions.forEach(region => {
        const feature = new Feature({
          geometry: new Point(fromLonLat(region.coordinates)),
          regionData: region
        });

        // Dynamic color based on active heatmap layer
        const getHeatmapColor = (value: number, layer: string) => {
          if (layer === 'depletion') {
            if (value >= 80) return '#E53935'; // Red - Critical
            if (value >= 60) return '#FB8C00'; // Orange - Semi-Critical  
            if (value >= 40) return '#FFEB3B'; // Yellow - Moderate
            return '#66BB6A'; // Green - Safe
          } else if (layer === 'recharge') {
            if (value >= 80) return '#66BB6A'; // Green - High recharge
            if (value >= 60) return '#FFEB3B'; // Yellow - Moderate
            if (value >= 40) return '#FB8C00'; // Orange - Low
            return '#E53935'; // Red - Very low
          } else if (layer === 'extraction') {
            if (value >= 120) return '#E53935'; // Red - Over-exploitation
            if (value >= 100) return '#FB8C00'; // Orange - High extraction
            if (value >= 80) return '#FFEB3B'; // Yellow - Moderate
            return '#66BB6A'; // Green - Sustainable
          } else { // forecast
            if (value >= 80) return '#E53935'; // Red - High risk
            if (value >= 60) return '#FB8C00'; // Orange - Medium risk
            if (value >= 40) return '#FFEB3B'; // Yellow - Moderate risk
            return '#66BB6A'; // Green - Low risk
          }
        };

        const value = region[activeHeatmapLayer as keyof typeof region] as number;
        const heatmapColor = getHeatmapColor(value, activeHeatmapLayer);

        feature.setStyle(new Style({
          image: new Circle({
            radius: 25,
            fill: new Fill({ 
              color: heatmapColor + '80' // Add transparency
            }),
            stroke: new Stroke({ 
              color: heatmapColor, 
              width: 3 
            })
          }),
          text: new Text({
            text: `${value}${activeHeatmapLayer === 'extraction' ? 'x' : '%'}`,
            fill: new Fill({ color: '#ffffff' }),
            font: 'bold 12px sans-serif',
            offsetY: 0
          })
        }));

        vectorSource.addFeature(feature);
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource
      });

      // Create map
      const map = new Map({
        target: mapRef.current,
        layers: [satelliteLayer, vectorLayer],
        view: new View({
          center: fromLonLat([78.9629, 20.5937]), // India center
          zoom: 5
        })
      });

      map.addOverlay(tooltip);

      // Handle click events
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        if (feature) {
          const regionData = feature.get('regionData');
          setSelectedRegion(regionData);
          tooltip.setPosition(evt.coordinate);
        } else {
          setSelectedRegion(null);
          tooltip.setPosition(undefined);
        }
      });

      // Handle hover effects
      map.on('pointermove', (evt) => {
        const hit = map.hasFeatureAtPixel(evt.pixel);
        const target = map.getTarget();
        if (target && typeof target !== 'string') {
          (target as HTMLElement).style.cursor = hit ? 'pointer' : '';
        }
      });

      olMapRef.current = map;

      // Layer switching function
      const switchLayer = (layerType: string) => {
        const layers = map.getLayers();
        layers.removeAt(0);
        
        switch (layerType) {
          case 'satellite':
            layers.insertAt(0, satelliteLayer);
            break;
          case 'terrain':
            layers.insertAt(0, terrainLayer);
            break;
          case 'street':
            layers.insertAt(0, streetLayer);
            break;
        }
      };

      // Store functions for external use
      (window as typeof window & { 
        switchMapLayer?: (layerType: string) => void;
        updateHeatmapLayer?: (layer: string) => void;
      }).switchMapLayer = switchLayer;

      return () => {
        if (olMapRef.current) {
          olMapRef.current.setTarget(undefined);
          olMapRef.current = null;
        }
      };
    }, [activeHeatmapLayer]);

    const handleLayerChange = (layerType: string) => {
      setCurrentMapLayer(layerType);
      const windowWithSwitch = window as typeof window & { switchMapLayer?: (layerType: string) => void };
      if (windowWithSwitch.switchMapLayer) {
        windowWithSwitch.switchMapLayer(layerType);
      }
    };

    const handleHeatmapLayerChange = (layer: string) => {
      setActiveHeatmapLayer(layer);
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Satellite className="h-6 w-6 mr-3 text-blue-600" />
              National Groundwater Heatmap
            </h2>
            <div className="flex items-center space-x-4">
              {/* Base Layer Controls */}
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Base:</span>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleLayerChange('satellite')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    currentMapLayer === 'satellite' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => handleLayerChange('terrain')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    currentMapLayer === 'terrain' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Terrain
                </button>
                <button
                  onClick={() => handleLayerChange('street')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    currentMapLayer === 'street' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Street
                </button>
              </div>
            </div>
          </div>

          {/* Heatmap Layer Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Heatmap Layer:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleHeatmapLayerChange('depletion')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeHeatmapLayer === 'depletion'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Depletion %
              </button>
              <button
                onClick={() => handleHeatmapLayerChange('recharge')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeHeatmapLayer === 'recharge'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Recharge %
              </button>
              <button
                onClick={() => handleHeatmapLayerChange('extraction')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeHeatmapLayer === 'extraction'
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Extraction Intensity
              </button>
              <button
                onClick={() => handleHeatmapLayerChange('forecast')}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeHeatmapLayer === 'forecast'
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Future Risk Forecast
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative h-[500px] rounded-xl overflow-hidden border border-gray-300">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Tooltip */}
            <div ref={tooltipRef} className={`absolute z-10 ${selectedRegion ? 'block' : 'hidden'}`}>
              {selectedRegion && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{selectedRegion.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      selectedRegion.category === 'safe' ? 'bg-green-100 text-green-700' :
                      selectedRegion.category === 'semi-critical' ? 'bg-orange-100 text-orange-700' :
                      selectedRegion.category === 'critical' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedRegion.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-medium">{selectedRegion.population}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Depletion:</span>
                      <span className="font-medium text-red-600">{selectedRegion.depletion}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recharge Rate:</span>
                      <span className="font-medium text-blue-600">{selectedRegion.recharge}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extraction:</span>
                      <span className="font-medium text-orange-600">{selectedRegion.extraction}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Forecast:</span>
                      <span className={`font-medium ${
                        selectedRegion.riskLevel === 'high' ? 'text-red-600' :
                        selectedRegion.riskLevel === 'medium' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {selectedRegion.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Trend:</span>
                      <span className={`font-medium ${
                        selectedRegion.trend === 'improving' ? 'text-green-600' :
                        selectedRegion.trend === 'declining' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {selectedRegion.trend.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-sm mb-3">
                {activeHeatmapLayer === 'depletion' ? 'Depletion Level' :
                 activeHeatmapLayer === 'recharge' ? 'Recharge Rate' :
                 activeHeatmapLayer === 'extraction' ? 'Extraction Intensity' :
                 'Future Risk Level'}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                  <span className="text-xs">
                    {activeHeatmapLayer === 'depletion' ? 'Safe (0-40%)' :
                     activeHeatmapLayer === 'recharge' ? 'High (80%+)' :
                     activeHeatmapLayer === 'extraction' ? 'Sustainable (<80x)' :
                     'Low Risk (0-40%)'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                  <span className="text-xs">
                    {activeHeatmapLayer === 'depletion' ? 'Moderate (40-60%)' :
                     activeHeatmapLayer === 'recharge' ? 'Moderate (60-80%)' :
                     activeHeatmapLayer === 'extraction' ? 'Moderate (80-100x)' :
                     'Medium Risk (40-60%)'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                  <span className="text-xs">
                    {activeHeatmapLayer === 'depletion' ? 'Semi-Critical (60-80%)' :
                     activeHeatmapLayer === 'recharge' ? 'Low (40-60%)' :
                     activeHeatmapLayer === 'extraction' ? 'High (100-120x)' :
                     'High Risk (60-80%)'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                  <span className="text-xs">
                    {activeHeatmapLayer === 'depletion' ? 'Critical (80%+)' :
                     activeHeatmapLayer === 'recharge' ? 'Very Low (<40%)' :
                     activeHeatmapLayer === 'extraction' ? 'Over-exploited (120x+)' :
                     'Critical Risk (80%+)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heatmapRegions.map((region) => (
            <div key={region.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{region.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  region.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                  region.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {region.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Population</span>
                  <span className="font-medium">{region.population}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">States</span>
                  <span className="font-medium text-xs">{region.states.join(', ')}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{region.depletion}%</div>
                    <div className="text-xs text-gray-500">Depletion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{region.recharge}%</div>
                    <div className="text-xs text-gray-500">Recharge</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // AI Recommendations Component
  const AIRecommendations = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-purple-600" />
          AI-Driven Policy Recommendations
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
            {aiRecommendations.filter(r => r.priority === 'Critical').length} Critical
          </span>
          <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
            {aiRecommendations.filter(r => r.priority === 'High').length} High Priority
          </span>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
        </div>
      </div>
      
      <div className="space-y-4">
        {aiRecommendations.map((rec) => (
          <div key={rec.id} className={`border-l-4 rounded-r-lg p-4 ${
            rec.priority === 'Critical' ? 'border-red-500 bg-red-50' : 
            rec.priority === 'High' ? 'border-orange-500 bg-orange-50' : 
            'border-yellow-500 bg-yellow-50'
          }`}>
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-2">
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    rec.priority === 'Critical' ? 'bg-red-200 text-red-800' : 
                    rec.priority === 'High' ? 'bg-orange-200 text-orange-800' : 
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {rec.priority}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {rec.category}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    AI: {rec.aiConfidence}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                <div className="flex flex-wrap items-center text-xs text-gray-600 gap-x-4 gap-y-1">
                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1.5" />{rec.timeline}</span>
                  <span className="flex items-center"><Target className="h-3 w-3 mr-1.5" />{rec.impact}</span>
                  <span className="flex items-center"><Activity className="h-3 w-3 mr-1.5" />Expected: {rec.expectedSavings}</span>
                  <span className="flex items-center font-medium">Budget: {rec.budgetImpact}</span>
                </div>
              </div>
              <div className="flex space-x-2 ml-auto md:ml-4 flex-shrink-0">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1.5">
                  <Eye className="h-4 w-4" />
                  <span>Details</span>
                </button>
                <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Main content renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <KPICards />
            <AIRecommendations />
            <div className="text-center py-10 text-gray-600">
              <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>Interactive heatmap visualization coming soon...</p>
            </div>
          </>
        );
      case 'heatmaps':
        return <HeatmapView />;
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Forecasting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">5-Year Depletion Forecast</h3>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">+18.5%</div>
                <div className="text-blue-100">Expected increase by 2029</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recharge Potential</h3>
                  <Droplets className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">+42%</div>
                <div className="text-green-100">With proposed interventions</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Climate Impact</h3>
                  <Globe className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">-12%</div>
                <div className="text-purple-100">Rainfall reduction projected</div>
              </div>
            </div>

            {/* Time Series Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">National Groundwater Trend</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <select className="text-sm border border-gray-300 rounded-lg px-2 py-1">
                      <option>Last 10 Years</option>
                      <option>Last 5 Years</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-500">Interactive time series chart</div>
                    <div className="text-sm text-gray-400">Showing depletion trends 2014-2024</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Regional Comparison</h3>
                  <div className="flex items-center space-x-2">
                    <PieChart className="h-4 w-4 text-gray-500" />
                    <select className="text-sm border border-gray-300 rounded-lg px-2 py-1">
                      <option>All Regions</option>
                      <option>Critical Only</option>
                      <option>Semi-Critical</option>
                    </select>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-500">Regional distribution chart</div>
                    <div className="text-sm text-gray-400">Comparative analysis by state</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Models */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-blue-600" />
                  AI-Powered Predictive Models
                </h3>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Updated 2 hours ago</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-red-800">Depletion Model</h4>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">87.3%</div>
                    <div className="text-sm text-red-700">Accuracy</div>
                    <div className="text-xs text-red-600">Neural Network + Climate Data</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-blue-800">Recharge Model</h4>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">92.1%</div>
                    <div className="text-sm text-blue-700">Accuracy</div>
                    <div className="text-xs text-blue-600">Satellite + Precipitation ML</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-orange-800">Usage Prediction</h4>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-600">84.7%</div>
                    <div className="text-sm text-orange-700">Accuracy</div>
                    <div className="text-xs text-orange-600">Population + Economic Model</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-purple-800">Risk Assessment</h4>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">91.4%</div>
                    <div className="text-sm text-purple-700">Accuracy</div>
                    <div className="text-xs text-purple-600">Ensemble Deep Learning</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Analysis */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-green-600" />
                  Policy Scenario Analysis
                </h3>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Configure Scenarios</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-green-800">Optimistic Scenario</h4>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-green-700">
                      • 70% reduction in over-extraction<br/>
                      • 50% increase in recharge structures<br/>
                      • Advanced monitoring systems deployed
                    </div>
                    <div className="border-t border-green-200 pt-3">
                      <div className="text-lg font-bold text-green-600">+35% Recovery</div>
                      <div className="text-sm text-green-600">by 2030</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-yellow-800">Moderate Scenario</h4>
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-yellow-700">
                      • 40% reduction in over-extraction<br/>
                      • 25% increase in recharge structures<br/>
                      • Gradual policy implementation
                    </div>
                    <div className="border-t border-yellow-200 pt-3">
                      <div className="text-lg font-bold text-yellow-600">+18% Recovery</div>
                      <div className="text-sm text-yellow-600">by 2030</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-red-800">Business as Usual</h4>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm text-red-700">
                      • Current extraction rates continue<br/>
                      • Minimal new interventions<br/>
                      • No major policy changes
                    </div>
                    <div className="border-t border-red-200 pt-3">
                      <div className="text-lg font-bold text-red-600">-25% Decline</div>
                      <div className="text-sm text-red-600">by 2030</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-600" />
              Policy Reports & Export
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">Parliament Report</h3>
                    <p className="text-sm text-gray-600">National water security briefing</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Generate PDF</span>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">State Water Board</h3>
                    <p className="text-sm text-gray-600">Regional implementation guide</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">Jal Shakti Ministry</h3>
                    <p className="text-sm text-gray-600">Comprehensive heatmap analysis</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export Images</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="h-6 w-6 mr-3 text-blue-600" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" defaultValue={userData.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" defaultValue={userData.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" defaultValue={userData.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Navigation component
  const NavTabs = () => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'heatmaps', label: 'Heatmaps', icon: Satellite },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'account', label: 'Account', icon: User }
    ];

    if (isMobile) {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                FlowSence
              </span>
            </div>
            <nav className="flex space-x-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search State/District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <User className="h-5 w-5" />
                <span>{userData.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <NavTabs />
      {/* Filter Bar */}
      {activeTab === 'dashboard' && !isMobile && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="1year">Last 1 Year</option>
              <option value="5years">Last 5 Years</option>
              <option value="10years">Last 10 Years</option>
            </select>
            <select
              value={selectedAquifer}
              onChange={(e) => setSelectedAquifer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Aquifers</option>
              <option value="shallow">Shallow Aquifer</option>
              <option value="deep">Deep Aquifer</option>
              <option value="confined">Confined Aquifer</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="safe">Safe</option>
              <option value="semi-critical">Semi-Critical</option>
              <option value="critical">Critical</option>
              <option value="over-exploited">Over-Exploited</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* Content will be rendered based on active tab */}
      <main className="p-6 pb-24 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default PolicyDashboard;