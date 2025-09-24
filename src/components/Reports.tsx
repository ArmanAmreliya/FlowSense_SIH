import React, { useState } from 'react';
import { Download, FileText, BarChart3, Eye, Share2 } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const reportTemplates = [
    {
      id: 1,
      title: 'Groundwater Status Report',
      description: 'Comprehensive overview of groundwater levels and trends',
      type: 'Status Report',
      lastGenerated: '2024-01-15',
      size: '2.4 MB',
      pages: 15,
    },
    {
      id: 2,
      title: 'Critical Zone Analysis',
      description: 'Detailed analysis of zones requiring immediate attention',
      type: 'Analysis Report',
      lastGenerated: '2024-01-14',
      size: '1.8 MB',
      pages: 12,
    },
    {
      id: 3,
      title: 'Conservation Impact Assessment',
      description: 'Evaluation of conservation measures effectiveness',
      type: 'Impact Report',
      lastGenerated: '2024-01-13',
      size: '3.1 MB',
      pages: 20,
    },
    {
      id: 4,
      title: 'Monthly Monitoring Summary',
      description: 'Summary of sensor data and monitoring activities',
      type: 'Monitoring Report',
      lastGenerated: '2024-01-12',
      size: '1.2 MB',
      pages: 8,
    },
  ];

  const dataExports = [
    { type: 'Sensor Data', records: '50,247', size: '125 MB', format: 'CSV' },
    { type: 'Water Level Measurements', records: '12,856', size: '45 MB', format: 'Excel' },
    { type: 'Zone Classifications', records: '247', size: '2.1 MB', format: 'JSON' },
    { type: 'Weather Data', records: '8,760', size: '28 MB', format: 'CSV' },
  ];

  return (
    <div className="container-responsive touch-spacing min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg flex-shrink-0">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <span>Reports & Export</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Generate comprehensive reports and export data for analysis
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Report Generation */}
        <div className="xl:col-span-2 space-y-6">
          {/* Generate New Report */}
          <div className="card-mobile">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Generate New Report</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white">
                  <option>Groundwater Status</option>
                  <option>Critical Zone Analysis</option>
                  <option>Conservation Impact</option>
                  <option>Monitoring Summary</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Time Period</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Format</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                >
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Workbook</option>
                  <option value="powerpoint">PowerPoint</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary flex-1">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </button>
              <button className="btn-secondary">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
            </div>
          </div>

          {/* Previous Reports */}
          <div className="card-mobile">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Previous Reports</h3>
            </div>

            <div className="space-y-4">
              {reportTemplates.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{report.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{report.type}</span>
                        <span>Generated: {report.lastGenerated}</span>
                        <span>{report.size}</span>
                        <span>{report.pages} pages</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="btn-secondary text-xs py-2 px-3">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button className="btn-primary text-xs py-2 px-3">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </button>
                      <button className="btn-secondary text-xs py-2 px-3">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Export Panel */}
        <div className="xl:col-span-1">
          <div className="card-mobile h-full">
            <div className="pb-4 border-b border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Download className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Data Export</span>
              </h3>
            </div>

            <div className="space-y-4">
              {dataExports.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm text-gray-800 flex-1 min-w-0 pr-2">
                      {item.type}
                    </h4>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded flex-shrink-0">
                      {item.format}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Records:</span>
                      <span className="font-medium">{item.records}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{item.size}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 btn-primary text-xs py-2">
                    <Download className="h-3 w-3 mr-1" />
                    Export Data
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Export Statistics</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Downloads:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Exported:</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reports Generated:</span>
                  <span className="font-medium">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;