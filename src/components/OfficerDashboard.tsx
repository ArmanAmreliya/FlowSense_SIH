import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Eye, CheckCircle, FileText, Download, Activity,
  Bell, Clock, Search, Filter, MapPin, Home, User,
  ChevronDown, Layers, BarChart3, TrendingUp, TrendingDown, Droplets,
  Zap, Target, RefreshCw, Maximize2,
  Satellite,
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
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

// Define the props interface for the component
interface OfficerDashboardProps {
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
}

/**
 * OfficerDashboard component provides a comprehensive interface for monitoring
 * and managing groundwater data, alerts, and reports.
 */
const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  userData = { name: 'Officer Sharma', email: 'officer@flowsence.gov.in', phone: '+91-9876543210' }
}) => {
  // State management for UI interactions
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedSensorType, setSelectedSensorType] = useState('all');
  const [selectedCriticality, setSelectedCriticality] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayers, setMapLayers] = useState({
    heatmap: true,
    iot: true,
    boundaries: false
  });
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check for mobile screen size on load and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Changed breakpoint for better tablet handling
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates for demo purposes
      const now = new Date();
      console.log(`Real-time update at ${now.toLocaleTimeString()}: Station data refreshed`);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Static data for demonstration
  const [activeAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Sudden Water Level Drop Detected',
      location: 'Zone 12 - Bopal Area, Ahmedabad',
      depth: '6.2m',
      previousDepth: '12.4m',
      time: '2 hours ago',
      severity: 'High',
      aiConfidence: '94%',
      description: 'AI detected 50% water level drop in 48 hours'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Declining Recharge Pattern',
      location: 'Zone 8 - Naranpura, Ahmedabad',
      depth: '11.3m',
      rechargeRate: '-15%',
      time: '5 hours ago',
      severity: 'Medium',
      aiConfidence: '87%',
      description: 'Continuous decline observed over 30 days'
    },
    {
      id: 3,
      type: 'anomaly',
      title: 'Sensor Communication Lost',
      location: 'Station ID: GW-AHM-045',
      depth: 'N/A',
      time: '8 hours ago',
      severity: 'Low',
      description: 'No data received for 12+ hours - possible maintenance required'
    }
  ]);

  const kpiData = {
    avgDepth: { value: 14.7, unit: 'm', trend: -2.3, status: 'warning' },
    rechargeRate: { value: 67, unit: '%', trend: +5.2, status: 'good' },
    depletion: { value: 23, unit: '%', trend: -1.8, status: 'good' },
    criticalZones: { value: 5, unit: 'zones', trend: +2, status: 'critical' }
  };

  // Enhanced station data with more comprehensive information
  const stationData = React.useMemo(() => [
    { 
      id: 1, 
      lat: 23.0225, 
      lng: 72.5714, 
      depth: 15.2, 
      status: 'safe', 
      zone: 'Bopal', 
      recharge: 85,
      stationId: 'GW-AHM-001',
      lastUpdated: '2 min ago',
      anomalies: 0,
      previousDepth: 14.8
    },
    { 
      id: 2, 
      lat: 23.0496, 
      lng: 72.5738, 
      depth: 8.3, 
      status: 'critical', 
      zone: 'SG Highway', 
      recharge: 35,
      stationId: 'GW-AHM-002',
      lastUpdated: '5 min ago',
      anomalies: 2,
      previousDepth: 12.4
    },
    { 
      id: 3, 
      lat: 23.0732, 
      lng: 72.5647, 
      depth: 12.7, 
      status: 'moderate', 
      zone: 'Naranpura', 
      recharge: 62,
      stationId: 'GW-AHM-003',
      lastUpdated: '1 min ago',
      anomalies: 0,
      previousDepth: 12.9
    },
    { 
      id: 4, 
      lat: 23.0258, 
      lng: 72.5873, 
      depth: 18.9, 
      status: 'safe', 
      zone: 'Prahlad Nagar', 
      recharge: 92,
      stationId: 'GW-AHM-004',
      lastUpdated: '3 min ago',
      anomalies: 0,
      previousDepth: 18.5
    },
    { 
      id: 5, 
      lat: 23.0352, 
      lng: 72.6245, 
      depth: 6.1, 
      status: 'critical', 
      zone: 'Satellite', 
      recharge: 28,
      stationId: 'GW-AHM-005',
      lastUpdated: '8 min ago',
      anomalies: 1,
      previousDepth: 7.8
    },
    { 
      id: 6, 
      lat: 23.0895, 
      lng: 72.5200, 
      depth: 14.1, 
      status: 'safe', 
      zone: 'Vastrapur', 
      recharge: 78,
      stationId: 'GW-AHM-006',
      lastUpdated: '4 min ago',
      anomalies: 0,
      previousDepth: 13.9
    },
    { 
      id: 7, 
      lat: 23.0100, 
      lng: 72.6100, 
      depth: 9.8, 
      status: 'moderate', 
      zone: 'Maninagar', 
      recharge: 58,
      stationId: 'GW-AHM-007',
      lastUpdated: '6 min ago',
      anomalies: 0,
      previousDepth: 10.2
    }
  ], []);

  // Helper functions for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <span className="h-4 w-4" />;
  };

  // Sub-components for better organization
  const NavTabs = () => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'map', label: 'Map View', icon: MapPin },
      { id: 'alerts', label: 'Alerts', icon: Bell },
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
                {activeAlerts.filter(a => a.type === 'critical').length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeAlerts.filter(a => a.type === 'critical').length}
                  </span>
                )}
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

  const FilterBar = () => (
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
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
        <select
          value={selectedSensorType}
          onChange={(e) => setSelectedSensorType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">All Sensors</option>
          <option value="dwlr">DWLR Only</option>
          <option value="telemetry">Telemetry</option>
          <option value="manual">Manual</option>
        </select>
        <select
          value={selectedCriticality}
          onChange={(e) => setSelectedCriticality(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="critical">Critical Only</option>
          <option value="warning">Warning & Above</option>
          <option value="normal">Normal Only</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );

  const KPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{kpiData.avgDepth.value}{kpiData.avgDepth.unit}</div>
              <div className="text-sm text-gray-600">Avg Depth</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getTrendIcon(kpiData.avgDepth.trend)}
              <span className="text-sm font-medium">{Math.abs(kpiData.avgDepth.trend)}%</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor('warning')}`}>
              {kpiData.avgDepth.status}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{kpiData.rechargeRate.value}{kpiData.rechargeRate.unit}</div>
              <div className="text-sm text-gray-600">Recharge Rate</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getTrendIcon(kpiData.rechargeRate.trend)}
              <span className="text-sm font-medium">{Math.abs(kpiData.rechargeRate.trend)}%</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor('good')}`}>
              {kpiData.rechargeRate.status}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{kpiData.depletion.value}{kpiData.depletion.unit}</div>
              <div className="text-sm text-gray-600">Depletion</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getTrendIcon(kpiData.depletion.trend)}
              <span className="text-sm font-medium">{Math.abs(kpiData.depletion.trend)}%</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor('good')}`}>
              {kpiData.depletion.status}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{kpiData.criticalZones.value}</div>
              <div className="text-sm text-gray-600">Critical Zones</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {getTrendIcon(kpiData.criticalZones.trend)}
              <span className="text-sm font-medium">{Math.abs(kpiData.criticalZones.trend)}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor('critical')}`}>
              {kpiData.criticalZones.status}
            </span>
          </div>
        </div>
    </div>
  );

  const SatelliteMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const olMapRef = useRef<Map | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [selectedStation, setSelectedStation] = useState<typeof stationData[0] | null>(null);
    const [currentMapLayer, setCurrentMapLayer] = useState('satellite');

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

      // Create vector source for DWLR stations
      const vectorSource = new VectorSource();

      // Add station features
      stationData.forEach(station => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([station.lng, station.lat])),
          stationData: station
        });

        const statusColor = station.status === 'safe' ? '#22c55e' : 
                           station.status === 'moderate' ? '#f59e0b' : '#ef4444';

        feature.setStyle(new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: statusColor }),
            stroke: new Stroke({ color: '#ffffff', width: 3 })
          }),
          text: new Text({
            text: station.stationId.split('-')[2],
            fill: new Fill({ color: '#ffffff' }),
            font: 'bold 10px sans-serif',
            offsetY: 1
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
          center: fromLonLat([72.5714, 23.0225]), // Ahmedabad center
          zoom: 12
        })
      });

      map.addOverlay(tooltip);

      // Handle click events
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        if (feature) {
          const stationData = feature.get('stationData');
          setSelectedStation(stationData);
          tooltip.setPosition(evt.coordinate);
        } else {
          setSelectedStation(null);
          tooltip.setPosition(undefined);
        }
      });

      // Handle hover effects
      map.on('pointermove', (evt) => {
        const hit = map.hasFeatureAtPixel(evt.pixel);
        const target = map.getTarget();
        if (target) {
          (target as HTMLElement).style.cursor = hit ? 'pointer' : '';
        }
      });

      olMapRef.current = map;

      // Layer switching function
      const switchLayer = (layerType: string) => {
        const layers = map.getLayers();
        layers.removeAt(0); // Remove current base layer
        
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

      // Store layer switching function for external use
      (window as typeof window & { switchMapLayer?: (layerType: string) => void }).switchMapLayer = switchLayer;

      return () => {
        if (olMapRef.current) {
          olMapRef.current.setTarget(undefined);
          olMapRef.current = null;
        }
      };
    }, []);

    const handleLayerChange = (layerType: string) => {
      setCurrentMapLayer(layerType);
      const windowWithSwitch = window as typeof window & { switchMapLayer?: (layerType: string) => void };
      if (windowWithSwitch.switchMapLayer) {
        windowWithSwitch.switchMapLayer(layerType);
      }
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Satellite className="h-6 w-6 mr-3 text-blue-600" />
            Interactive Satellite Map - DWLR Monitoring
          </h3>
          <div className="flex items-center space-x-4">
            {/* Layer Controls */}
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">View:</span>
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
            
            {/* Layer Toggles */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={mapLayers.heatmap} 
                onChange={(e) => setMapLayers({...mapLayers, heatmap: e.target.checked})} 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm">Heatmap</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={mapLayers.boundaries} 
                onChange={(e) => setMapLayers({...mapLayers, boundaries: e.target.checked})} 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm">Admin Boundaries</span>
            </label>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-96 rounded-xl overflow-hidden border border-gray-300">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Tooltip */}
          <div ref={tooltipRef} className={`absolute z-10 ${selectedStation ? 'block' : 'hidden'}`}>
            {selectedStation && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{selectedStation.stationId}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    selectedStation.status === 'safe' ? 'bg-green-100 text-green-700' :
                    selectedStation.status === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedStation.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedStation.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Water Depth:</span>
                    <span className="font-medium text-blue-600">{selectedStation.depth}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recharge Rate:</span>
                    <span className="font-medium text-green-600">{selectedStation.recharge}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Change:</span>
                    <span className={`font-medium ${
                      selectedStation.depth > selectedStation.previousDepth ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedStation.depth > selectedStation.previousDepth ? '+' : ''}
                      {(selectedStation.depth - selectedStation.previousDepth).toFixed(1)}m
                    </span>
                  </div>
                  {selectedStation.anomalies > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Anomalies:</span>
                      <span className="font-medium text-red-600">{selectedStation.anomalies} detected</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{selectedStation.lastUpdated}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-sm mb-3">Station Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span className="text-xs">Safe (&gt;12m)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span className="text-xs">Moderate (8-12m)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span className="text-xs">Critical (&lt;8m)</span>
              </div>
            </div>
          </div>

          {/* Station Count */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600">Active Stations</div>
            <div className="text-lg font-bold text-blue-600">{stationData.length}</div>
          </div>
        </div>
      </div>
    );
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    // Mock export functionality
    const reportData = {
      timestamp: new Date().toISOString(),
      stations: stationData,
      alerts: activeAlerts,
      kpis: kpiData
    };
    
    console.log(`Exporting ${format.toUpperCase()} report:`, reportData);
    
    // In a real implementation, this would generate and download the file
    alert(`${format.toUpperCase()} report export initiated. Check downloads folder.`);
  };

  const AlertsSection = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Zap className="h-6 w-6 mr-3 text-yellow-600" />
                AI-Detected Anomalies & Alerts
            </h3>
            <div className="flex items-center space-x-4">
                <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                  {activeAlerts.filter(a => a.type === 'critical').length} Critical
                </span>
                <span className="text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-medium">
                  {activeAlerts.filter(a => a.type === 'warning').length} Warning
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => exportReport('pdf')}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                  <button 
                    onClick={() => exportReport('csv')}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>CSV</span>
                  </button>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
            </div>
        </div>
        <div className="space-y-4">
            {activeAlerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 rounded-r-lg p-4 ${ alert.type === 'critical' ? 'border-red-500 bg-red-50' : alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50' }`}>
                    <div className="flex flex-col md:flex-row items-start justify-between">
                        <div className="flex-1 mb-4 md:mb-0">
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-2">
                                <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${alert.severity === 'High' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{alert.severity}</span>
                                {alert.aiConfidence && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">AI: {alert.aiConfidence}</span>}
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                            <div className="flex flex-wrap items-center text-xs text-gray-600 gap-x-4 gap-y-1">
                                <span className="flex items-center"><Clock className="h-3 w-3 mr-1.5" />{alert.time}</span>
                                <span className="flex items-center"><Target className="h-3 w-3 mr-1.5" />{alert.location}</span>
                                {alert.depth !== 'N/A' && <span className="flex items-center"><Droplets className="h-3 w-3 mr-1.5" />Current: {alert.depth}</span>}
                            </div>
                        </div>
                        <div className="flex space-x-2 ml-auto md:ml-4 flex-shrink-0">
                            <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1.5"><CheckCircle className="h-4 w-4" /><span>Validate</span></button>
                            <button className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center space-x-1.5"><Eye className="h-4 w-4" /><span>Inspect</span></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const AnalyticsCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Historical Depth Trends
                </h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2 p-4 border-b border-gray-200">
                {[8, 12, 15, 11, 9, 14, 16, 13, 10, 7, 12, 15].map((h, i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t flex-1 transition-all duration-300 hover:opacity-80 cursor-pointer relative group" 
                      style={{ height: `${h * 5}%` }} 
                      title={`Day ${i+1}: ${h}m`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}m
                      </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>30 days ago</span>
                <span>Today</span>
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Recharge vs Extraction Balance
                </h3>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Current Balance</div>
                    <div className="text-lg font-bold text-green-600">+40%</div>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recharge Rate</span>
                        <span className="text-sm font-medium text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div></div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Extraction Rate</span>
                        <span className="text-sm font-medium text-red-600">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: '45%' }}></div></div>
                </div>
                <div className="border-t border-gray-200 pt-4 text-center">
                    <div className="text-sm text-gray-600">Net Balance</div>
                    <div className="text-xl font-bold text-green-600">+40%</div>
                </div>
            </div>
        </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-3 text-blue-600" />
          Report Generation & Export
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">Station Summary</h3>
                <p className="text-sm text-gray-600">Zone-wise monitoring report</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => exportReport('pdf')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => exportReport('csv')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">Alerts Report</h3>
                <p className="text-sm text-gray-600">AI anomaly detection summary</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => exportReport('pdf')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => exportReport('csv')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">Trend Analysis</h3>
                <p className="text-sm text-gray-600">Historical data insights</p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => exportReport('pdf')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => exportReport('csv')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Critical threshold alerts</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Daily monitoring reports</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Anomaly detection alerts</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </label>
        </div>
      </div>
    </div>
  );

  // Main content renderer based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <KPICards />
            <SatelliteMap />
            <AlertsSection />
            <AnalyticsCharts />
          </>
        );
      case 'map':
        return (
          <div className="h-[calc(100vh-200px)]">
            <SatelliteMap />
          </div>
        );
      case 'alerts':
        return (
          <div className="space-y-6">
            <AlertsSection />
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Alert History</h3>
              <p className="text-gray-600">Comprehensive alert management interface would be displayed here.</p>
            </div>
          </div>
        );
      case 'reports':
        return <ReportsTab />;
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <NavTabs />
      {activeTab === 'dashboard' && !isMobile && <FilterBar />}
      <main className="p-6 pb-24 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default OfficerDashboard;