import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, BarChart3, Filter, Zap, Activity, 
  TrendingUp, TrendingDown, CheckCircle, Download, Eye,
  Bell, Clock, AlertTriangle, Droplet, Satellite,
  Layers, Navigation
} from 'lucide-react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Heatmap from 'ol/layer/Heatmap'; // Import Heatmap layer
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

// KPI Card Component with Enhanced Animations (No Changes)
type KPICardColor = 'blue' | 'green' | 'red' | 'purple';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: KPICardColor;
  delay?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend, icon: Icon, color, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorClasses = {
    blue: 'from-blue-500 to-cyan-600 shadow-blue-500/25',
    green: 'from-emerald-500 to-green-600 shadow-emerald-500/25',
    red: 'from-red-500 to-rose-600 shadow-red-500/25',
    purple: 'from-purple-500 to-indigo-600 shadow-purple-500/25'
  };

  return (
    <div className={`relative group transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {change}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-100/50 rounded-full -translate-y-2 translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

interface DWLRDataPoint {
  id: string;
  location: [number, number];
  value: number;
  depth: string;
  status: 'safe' | 'warning' | 'critical';
  timestamp: string;
}

// --- MODIFIED DWLRHeatmapView Component ---
const DWLRHeatmapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [selectedLayer, setSelectedLayer] = useState('satellite');

  const dwlrData: DWLRDataPoint[] = React.useMemo(() => [
    { id: '1', location: [72.5714, 23.0225], value: 25.4, depth: '25.4m', status: 'safe', timestamp: '2024-01-15T10:30:00Z' },
    { id: '2', location: [72.6369, 23.0395], value: 18.2, depth: '18.2m', status: 'warning', timestamp: '2024-01-15T10:30:00Z' },
    { id: '3', location: [72.5950, 23.0885], value: 8.7, depth: '8.7m', status: 'critical', timestamp: '2024-01-15T10:30:00Z' },
    { id: '4', location: [72.5200, 23.0600], value: 32.1, depth: '32.1m', status: 'safe', timestamp: '2024-01-15T10:30:00Z' },
    { id: '5', location: [72.6100, 23.0100], value: 15.3, depth: '15.3m', status: 'warning', timestamp: '2024-01-15T10:30:00Z' },
    // Adding more data for a better heatmap effect
    { id: '6', location: [72.5980, 23.0900], value: 7.5, depth: '7.5m', status: 'critical', timestamp: '2024-01-15T10:30:00Z' },
    { id: '7', location: [72.6000, 23.0870], value: 9.1, depth: '9.1m', status: 'critical', timestamp: '2024-01-15T10:30:00Z' },
  ], []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Layer sources (same as before)
    const osmLayer = new TileLayer({
      source: new OSM(),
      properties: { name: 'street' }
    });
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
      properties: { name: 'satellite' }
    });
    const terrainLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
      }),
      properties: { name: 'terrain' }
    });

    // Create features for the heatmap source
    const dwlrFeatures = dwlrData.map(point => new Feature({
      geometry: new Point(fromLonLat(point.location)),
      ...point
    }));

    const vectorSource = new VectorSource({
      features: dwlrFeatures
    });

    // Create the Heatmap Layer
    const heatmapLayer = new Heatmap({
      source: vectorSource,
      blur: 20,
      radius: 15,
      // Weight features based on their status for intensity
      weight: (feature) => {
        const status = feature.get('status');
        if (status === 'critical') return 1.0;   // High intensity
        if (status === 'warning') return 0.6;  // Medium intensity
        return 0.2;                            // Low intensity (safe)
      },
      // Gradient colors from cool (safe) to hot (critical)
      gradient: ['#22c55e', '#facc15', '#ef4444'],
    });

    // Initialize map
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [satelliteLayer, osmLayer, terrainLayer, heatmapLayer],
      view: new View({
        center: fromLonLat([72.5714, 23.0395]), // Ahmedabad center
        zoom: 11
      }),
      controls: []
    });

    // Initially show only satellite layer
    osmLayer.setVisible(false);
    terrainLayer.setVisible(false);

    setMap(mapInstance);

    return () => {
      mapInstance.setTarget(undefined);
    };
  }, [dwlrData]);

  useEffect(() => {
    if (!map) return;
    map.getLayers().forEach(layer => {
      if (layer instanceof TileLayer) {
        const layerName = layer.get('name');
        layer.setVisible(layerName === selectedLayer);
      }
    });
  }, [map, selectedLayer]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-blue-600" />
          DWLR Heatmap View
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedLayer('satellite')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                selectedLayer === 'satellite' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Satellite className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedLayer('street')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                selectedLayer === 'street' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Navigation className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedLayer('terrain')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                selectedLayer === 'terrain' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapPin className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-inner"
        />
        
        {/* MODIFIED Legend for Heatmap */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Water Level Intensity</h4>
          <div className="w-40 h-3 rounded-md bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"></div>
          <div className="flex justify-between text-xs text-gray-700 mt-1">
            <span>Safe</span>
            <span>Critical</span>
          </div>
        </div>

        {/* Real-time indicator (No changes) */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">Live Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Panel with Enhanced UI (No Changes)
const AlertPanel = () => {
  const alerts = [
    { id: 1, type: 'critical', message: 'Water level critically low in Zone 3', time: '2 min ago', icon: AlertTriangle },
    { id: 2, type: 'warning', message: 'Declining trend detected in Zone 2', time: '15 min ago', icon: TrendingDown },
    { id: 3, type: 'info', message: 'Normal recharge activity in Zone 1', time: '1 hour ago', icon: CheckCircle }
  ];

  interface Alert {
    id: number;
    type: 'critical' | 'warning' | 'info' | string;
    message: string;
    time: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const getAlertColor = (type: Alert['type']): string => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 text-red-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info': return 'border-green-200 bg-green-50 text-green-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Recent Alerts
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Activity className="h-4 w-4 mr-1" />
          Live
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const IconComponent = alert.icon;
          return (
            <div
              key={alert.id}
              className={`border rounded-xl p-4 transition-all duration-300 hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 ${getAlertColor(alert.type)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.message}</p>
                  <div className="flex items-center mt-2 text-xs opacity-75">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// Main Dashboard Component (No Changes)
const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Enhanced Typography */}
        <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 flex items-center">
                <Droplet className="h-8 w-8 mr-3 text-blue-600" />
                Groundwater Intelligence
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Real-time monitoring of groundwater resources for Ahmedabad, Gujarat as of 5:25 PM, Sep 22, 2025.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div className={`bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.2s' }}>
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Filters & Controls</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md">
                  <option>Gujarat - Ahmedabad</option>
                  <option>Maharashtra - Mumbai</option>
                  <option>Karnataka - Bangalore</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Time Period</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Data Type</label>
              <div className="relative">
                <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md">
                  <option>Water Level</option>
                  <option>Quality Index</option>
                  <option>Recharge Rate</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Action</label>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                <Zap className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* DWLR Heatmap View */}
        <DWLRHeatmapView />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* KPI Cards & Actions */}
          <div className="xl:col-span-2 space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Avg. Water Level" value="18.8m" change="-1.2m" trend="down" icon={Droplet} color="blue" delay={300}/>
                <KPICard title="Safe Stations" value="40%" change="+5%" trend="up" icon={CheckCircle} color="green" delay={400}/>
                <KPICard title="Critical Stations" value="28%" change="+2%" trend="down" icon={AlertTriangle} color="red" delay={500}/>
                <KPICard title="Quality Index" value="7.2/10" change="+0.3" trend="up" icon={Activity} color="purple" delay={600}/>
             </div>
             <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 font-medium">
                        <BarChart3 className="h-5 w-5 mr-3" />
                        <span>Analytics</span>
                    </button>
                    <button className="w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 font-medium">
                        <Download className="h-5 w-5 mr-3" />
                        <span>Export Report</span>
                    </button>
                    <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                        <Eye className="h-5 w-5 mr-3" />
                        <span>Monitor</span>
                    </button>
                </div>
            </div>
          </div>
          
          {/* Enhanced Alerts Section */}
          <div className="xl:col-span-1">
            <AlertPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;