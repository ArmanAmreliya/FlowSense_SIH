import React, { useState, useRef, useEffect } from 'react';
import {
  Droplet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Sprout,
  Search,
  Bell,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  Menu,
  X,
  Home,
  User,
  BarChart3,
  Zap,
  Phone,
  Mail,
  Navigation,
  Satellite,
  Filter
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

// TypeScript Interfaces
interface UserData {
  name: string;
  email: string;
  phone: string;
  location: {
    district: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
}

interface WaterData {
  currentDepth: string;
  rechargeRate: string;
  depletionRate: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  quality: 'good' | 'moderate' | 'poor';
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  forecast: string;
}

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
  location: string;
}

// Map Component with OpenLayers Integration
const InteractiveMap: React.FC<{ activeFilter: string }> = ({ activeFilter }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'street'>('satellite');
  const [showFilters, setShowFilters] = useState(false);

  interface Zone {
    id: number;
    coordinates: [number, number]; // [longitude, latitude]
    type: 'safe' | 'moderate' | 'critical';
    depth: string;
    recharge: 'high' | 'medium' | 'low';
    location: string;
  }

  // Real coordinates around Ahmedabad area for farmer locations
  const zones: Zone[] = React.useMemo(() => [
    { id: 1, coordinates: [72.5714, 23.0225], type: 'safe', depth: '18.5m', recharge: 'high', location: 'North Farm Area' },
    { id: 2, coordinates: [72.6369, 23.0395], type: 'moderate', depth: '23.2m', recharge: 'medium', location: 'Central Fields' },
    { id: 3, coordinates: [72.5950, 23.0885], type: 'critical', depth: '35.7m', recharge: 'low', location: 'Western Region' },
    { id: 4, coordinates: [72.5200, 23.0600], type: 'safe', depth: '16.1m', recharge: 'high', location: 'Eastern Fields' },
    { id: 5, coordinates: [72.6100, 23.0100], type: 'moderate', depth: '28.3m', recharge: 'medium', location: 'Southern Area' }
  ], []);

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'safe': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Create base layers
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
      }),
      properties: { name: 'satellite' }
    });

    const terrainLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Esri, USGS, NOAA'
      }),
      properties: { name: 'terrain' }
    });

    const streetLayer = new TileLayer({
      source: new OSM(),
      properties: { name: 'street' }
    });

    // Create zone features with filtering
    const filteredZones = zones.filter(zone => {
      switch (activeFilter) {
        case 'depth': return zone.type === 'critical';
        case 'recharge': return zone.recharge === 'high';
        case 'depletion': return zone.type === 'critical';
        default: return true;
      }
    });

    const zoneFeatures = filteredZones.map(zone => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(zone.coordinates)),
        ...zone
      });

      const style = new Style({
        image: new Circle({
          radius: activeFilter === 'all' ? 8 : 12,
          fill: new Fill({ color: getZoneColor(zone.type) }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        }),
        text: new Text({
          text: zone.id.toString(),
          fill: new Fill({ color: '#ffffff' }),
          font: 'bold 12px Arial',
          offsetY: 1
        })
      });

      feature.setStyle(style);
      return feature;
    });

    const vectorSource = new VectorSource({
      features: zoneFeatures
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Initialize map
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [satelliteLayer, terrainLayer, streetLayer, vectorLayer],
      view: new View({
        center: fromLonLat([72.5714, 23.0395]), // Ahmedabad center
        zoom: 12
      }),
      controls: []
    });

    // Set initial layer visibility
    terrainLayer.setVisible(false);
    streetLayer.setVisible(false);

    // Tooltip overlay
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'absolute bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none z-50 shadow-lg';
    
    const tooltip = new Overlay({
      element: tooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });

    mapInstance.addOverlay(tooltip);

    // Mouse interaction for tooltips
    mapInstance.on('pointermove', (evt) => {
      const feature = mapInstance.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      
      if (feature) {
        const coordinates = evt.coordinate;
        const props = feature.getProperties();
        tooltipElement.innerHTML = `
          <div class="font-medium">${props.location}</div>
          <div>Depth: ${props.depth}</div>
          <div>Status: ${props.type.charAt(0).toUpperCase() + props.type.slice(1)}</div>
          <div>Recharge: ${props.recharge.charAt(0).toUpperCase() + props.recharge.slice(1)}</div>
        `;
        tooltip.setPosition(coordinates);
        tooltipElement.style.display = 'block';
        mapInstance.getViewport().style.cursor = 'pointer';
      } else {
        tooltipElement.style.display = 'none';
        mapInstance.getViewport().style.cursor = '';
      }
    });

    setMap(mapInstance);

    return () => {
      mapInstance.setTarget(undefined);
    };
  }, [activeFilter]);

  useEffect(() => {
    if (!map) return;

    // Update visible layer based on selection
    map.getLayers().forEach(layer => {
      if (layer instanceof TileLayer) {
        const layerName = layer.get('name');
        layer.setVisible(layerName === mapView);
      }
    });
  }, [map, mapView]);

  return (
    <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      {/* OpenLayers Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Layer Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex">
            <button
              onClick={() => setMapView('satellite')}
              className={`p-2 rounded-l-lg transition-all duration-200 ${
                mapView === 'satellite' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Satellite View"
            >
              <Satellite className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMapView('terrain')}
              className={`p-2 transition-all duration-200 ${
                mapView === 'terrain' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Terrain View"
            >
              <MapPin className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMapView('street')}
              className={`p-2 rounded-r-lg transition-all duration-200 ${
                mapView === 'street' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Street View"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors ${
            showFilters ? 'text-blue-600' : 'text-gray-600'
          }`}
          title="Toggle Filters"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-48">
          <h4 className="font-medium text-gray-800 mb-3">Map Filters</h4>
          <div className="space-y-2 text-sm">
            <div className="text-gray-600">Active Filter: <span className="font-medium capitalize">{activeFilter}</span></div>
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Showing zones based on current filter</div>
              {activeFilter === 'depth' && <div className="text-xs text-red-600">Critical depth zones only</div>}
              {activeFilter === 'recharge' && <div className="text-xs text-green-600">High recharge zones only</div>}
              {activeFilter === 'depletion' && <div className="text-xs text-red-600">High depletion zones only</div>}
              {activeFilter === 'all' && <div className="text-xs text-blue-600">All zones visible</div>}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">Water Status</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Safe (&lt;20m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Moderate (20-30m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Critical (&gt;30m)</span>
          </div>
        </div>
      </div>

      {/* Current View Indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <div className="text-xs text-gray-600">
          View: <span className="font-medium capitalize">{mapView}</span>
        </div>
      </div>
    </div>
  );
};

// Mobile Navigation
const MobileNav: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'advisory', label: 'Advisory', icon: Sprout },
    { id: 'account', label: 'Account', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
      <div className="flex justify-around py-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Sidebar Navigation (Desktop)
const Sidebar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void; isOpen: boolean; onToggle: () => void }> = ({ activeTab, onTabChange, isOpen, onToggle }) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'advisory', label: 'Advisory', icon: Sprout },
    { id: 'account', label: 'Account', icon: User }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
     
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Droplet className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-800">FlowSence</span>
            </div>
            <button onClick={onToggle} className="lg:hidden">
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
         
          <nav className="space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

// Main Dashboard Component
const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchLocation, setSearchLocation] = useState('Ahmedabad, Gujarat');

  const userData: UserData = {
    name: 'Ramesh Patel',
    email: 'ramesh.patel@example.com',
    phone: '+91 98765 43210',
    location: {
      district: 'Ahmedabad',
      state: 'Gujarat',
      coordinates: { lat: 23.0225, lng: 72.5714 }
    }
  };

  const waterData: WaterData = {
    currentDepth: '15.2m',
    rechargeRate: '68%',
    depletionRate: '12%',
    lastUpdated: '2 hours ago',
    trend: 'down',
    quality: 'moderate'
  };

  const weatherData: WeatherData = {
    temperature: 32,
    humidity: 65,
    rainfall: 45,
    windSpeed: 8,
    forecast: 'Partly cloudy with chance of rain'
  };

  const alerts: Alert[] = [
    { id: 1, type: 'warning', message: 'Water level declining in your area', time: '2h ago', location: 'Zone 2' },
    { id: 2, type: 'info', message: 'Rainfall expected in next 3 days', time: '4h ago', location: 'District' },
    { id: 3, type: 'critical', message: 'Critical depletion detected nearby', time: '6h ago', location: 'Zone 3' }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 text-red-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Search and Map Section */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Search Location (State / District / Block)"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Zones</option>
                    <option value="depth">Water Depth</option>
                    <option value="recharge">Recharge Rate</option>
                    <option value="depletion">Depletion</option>
                  </select>
                </div>
              </div>
              <InteractiveMap activeFilter={activeFilter} />
            </div>

            {/* Water Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                    <Droplet className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{waterData.currentDepth}</div>
                    <div className="text-sm text-gray-600">Below Ground Level</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Current Water Depth</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{waterData.rechargeRate}</div>
                    <div className="text-sm text-gray-600">Monthly Average</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Recharge Rate</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{waterData.depletionRate}</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Depletion Rate</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>

            {/* AI Advisory and Location Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <Zap className="h-6 w-6 text-yellow-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">AI Irrigation Advisory</h3>
                </div>
                <div className="p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50 mb-4">
                  <div className="font-semibold text-yellow-800 mb-2">Reduce irrigation by 20% this week</div>
                  <div className="text-sm text-yellow-700 mb-3">
                    Water levels are declining. Switch to drip irrigation during cooler hours (6-8 AM and 6-8 PM).
                  </div>
                  <div className="flex items-center text-xs text-yellow-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Next review in 3 days
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Quick Tips:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Use drip irrigation to save 40% water
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Water crops during cooler hours
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Farm Location</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="font-medium text-gray-800 mb-2">{userData.location.district}, {userData.location.state}</div>
                    <div className="text-sm text-gray-600 mb-3">Zone 2 - Moderate Risk Area</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Rainfall (30d)</div>
                        <div className="font-medium">{weatherData.rainfall}mm</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Temperature</div>
                        <div className="font-medium">{weatherData.temperature}°C</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Recent Alerts
              </h3>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-xl p-4 ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="text-sm opacity-75">
                          {alert.location} • {alert.time}
                        </div>
                      </div>
                      <AlertTriangle className="h-5 w-5 mt-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                Weather Forecast
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{weatherData.temperature}°C</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <CloudRain className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Rainfall</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{weatherData.rainfall}mm</div>
                </div>
                <div className="p-4 bg-cyan-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Droplet className="h-5 w-5 text-cyan-500 mr-2" />
                    <span className="text-sm text-gray-600">Humidity</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{weatherData.humidity}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Wind className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Wind Speed</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{weatherData.windSpeed} km/h</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                <div className="font-medium text-gray-800 mb-2">7-Day Forecast</div>
                <div className="text-gray-600">{weatherData.forecast}</div>
              </div>
            </div>
          </div>
        );

      case 'advisory':
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Sprout className="h-5 w-5 mr-2 text-green-600" />
                Farming Advisory
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
                  <div className="font-medium text-green-800 mb-2">Recommended Actions</div>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Switch to drought-resistant crop varieties</li>
                    <li>• Implement mulching to reduce water loss</li>
                    <li>• Consider rainwater harvesting systems</li>
                    <li>• Schedule field visits with extension officers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{userData.name}</div>
                    <div className="text-sm text-gray-600">{userData.location.district}, {userData.location.state}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{userData.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{userData.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Navigation className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Coordinates</div>
                      <div className="font-medium">
                        {userData.location.coordinates.lat}°N, {userData.location.coordinates.lng}°E
                      </div>
                    </div>
                  </div>
                </div>
               
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg font-medium">
                      <Droplet className="h-5 w-5" />
                      <span>Request Water Test</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium">
                      <Calendar className="h-5 w-5" />
                      <span>Schedule Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        default:
          return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 min-h-screen flex font-sans">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 w-full lg:w-auto overflow-y-auto">
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 -ml-2 text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userData.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">Here's the latest update on your farm's water resources.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div>
            {renderTabContent()}
          </div>
        </div>
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default FarmerDashboard;