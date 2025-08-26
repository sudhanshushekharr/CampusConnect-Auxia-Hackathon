import React, { useState } from 'react';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  EyeIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const FraudDetection = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('');

  // Mock fraud detection data
  const [fraudAlerts] = useState([
    {
      id: 1,
      type: 'location_anomaly',
      title: 'Suspicious Location Pattern',
      description: 'Student checked in from multiple distant locations within short time frame',
      severity: 'high',
      studentId: 'STU001',
      studentName: 'John Doe',
      eventId: 'EVT123',
      eventName: 'AI Workshop',
      timestamp: '2024-12-25T14:30:00Z',
      details: {
        locations: [
          { lat: 12.9716, lng: 77.5946, address: 'Bangalore Campus', time: '14:25' },
          { lat: 13.0827, lng: 80.2707, address: 'Chennai Location', time: '14:30' }
        ],
        deviceInfo: 'iPhone 12 Pro',
        ipAddress: '192.168.1.100',
        riskScore: 95
      },
      status: 'pending'
    },
    {
      id: 2,
      type: 'device_spoofing',
      title: 'Multiple Device Check-ins',
      description: 'Same student account accessed from different devices simultaneously',
      severity: 'high',
      studentId: 'STU002',
      studentName: 'Sarah Wilson',
      eventId: 'EVT124',
      eventName: 'Blood Donation Camp',
      timestamp: '2024-12-25T10:15:00Z',
      details: {
        devices: [
          { type: 'Android Phone', model: 'Samsung Galaxy S21', ip: '192.168.1.101', time: '10:15' },
          { type: 'iPhone', model: 'iPhone 13', ip: '192.168.1.102', time: '10:16' }
        ],
        riskScore: 88
      },
      status: 'investigating'
    },
    {
      id: 3,
      type: 'time_anomaly',
      title: 'Impossible Time Sequence',
      description: 'Student checked in before event start time or after end time',
      severity: 'medium',
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      eventId: 'EVT125',
      eventName: 'Photography Contest',
      timestamp: '2024-12-24T08:30:00Z',
      details: {
        eventTime: '10:00 AM - 5:00 PM',
        checkInTime: '08:30 AM',
        timeDifference: '-1.5 hours',
        riskScore: 65
      },
      status: 'resolved'
    },
    {
      id: 4,
      type: 'pattern_recognition',
      title: 'Unusual Attendance Pattern',
      description: 'Student showing irregular check-in patterns across multiple events',
      severity: 'medium',
      studentId: 'STU004',
      studentName: 'Emily Chen',
      eventId: 'Multiple',
      eventName: 'Pattern Analysis',
      timestamp: '2024-12-24T16:45:00Z',
      details: {
        eventsAnalyzed: 15,
        anomalyScore: 72,
        patterns: [
          'Always checks in exactly at event start time',
          'Never stays for full duration',
          'Consistent GPS coordinates'
        ],
        riskScore: 58
      },
      status: 'monitoring'
    },
    {
      id: 5,
      type: 'capacity_violation',
      title: 'Event Capacity Exceeded',
      description: 'More check-ins detected than event capacity allows',
      severity: 'low',
      studentId: 'System',
      studentName: 'Automated Alert',
      eventId: 'EVT126',
      eventName: 'Tech Talk Series',
      timestamp: '2024-12-24T14:20:00Z',
      details: {
        capacity: 50,
        checkedIn: 53,
        overflow: 3,
        riskScore: 35
      },
      status: 'pending'
    }
  ]);

  const [detectionStats] = useState({
    totalAlerts: fraudAlerts.length,
    highRisk: fraudAlerts.filter(alert => alert.severity === 'high').length,
    mediumRisk: fraudAlerts.filter(alert => alert.severity === 'medium').length,
    lowRisk: fraudAlerts.filter(alert => alert.severity === 'low').length,
    resolved: fraudAlerts.filter(alert => alert.status === 'resolved').length,
    accuracy: 92.5,
    falsePositives: 7.5
  });

  const filteredAlerts = fraudAlerts.filter(alert => 
    filterSeverity === '' || alert.severity === filterSeverity
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'investigating':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'monitoring':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowAlertDetails(true);
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-600' };
    if (score >= 60) return { level: 'High', color: 'text-orange-600' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Fraud Detection</h2>
          <p className="text-gray-600">Advanced fraud detection and prevention system</p>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          <span className="text-sm font-medium text-green-600">System Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{detectionStats.totalAlerts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{detectionStats.accuracy}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{detectionStats.highRisk}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{detectionStats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fraud Alerts</h3>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Severities</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const risk = getRiskLevel(alert.details.riskScore);
            
            return (
              <div key={alert.id} className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <h4 className="font-semibold">{alert.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>Student: {alert.studentName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Event: {alert.eventName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">Risk Score:</span>
                        <span className={`text-sm font-bold ${risk.color}`}>
                          {alert.details.riskScore}/100 ({risk.level})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewDetails(alert)}
                    className="ml-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              All systems are operating normally.
            </p>
          </div>
        )}
      </div>

      {/* Alert Details Modal */}
      {showAlertDetails && selectedAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Fraud Alert Details</h3>
                <button
                  onClick={() => setShowAlertDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Alert Overview */}
                <div className={`border-l-4 rounded-lg p-4 ${getSeverityColor(selectedAlert.severity)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    <h4 className="text-xl font-semibold">{selectedAlert.title}</h4>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status}
                    </span>
                  </div>
                  <p className="mb-4">{selectedAlert.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Student:</strong> {selectedAlert.studentName} ({selectedAlert.studentId})
                    </div>
                    <div>
                      <strong>Event:</strong> {selectedAlert.eventName}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <strong>Risk Score:</strong> 
                      <span className={`ml-2 font-bold ${getRiskLevel(selectedAlert.details.riskScore).color}`}>
                        {selectedAlert.details.riskScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="text-lg font-semibold mb-4">Detailed Analysis</h5>
                  
                  {selectedAlert.type === 'location_anomaly' && (
                    <div className="space-y-4">
                      <h6 className="font-medium flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        Location Timeline
                      </h6>
                      {selectedAlert.details.locations.map((location, index) => (
                        <div key={index} className="bg-white rounded p-3 border-l-4 border-red-400">
                          <div className="flex items-center justify-between">
                            <span>{location.address}</span>
                            <span className="text-sm text-gray-500">{location.time}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {location.lat}, {location.lng}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedAlert.type === 'device_spoofing' && (
                    <div className="space-y-4">
                      <h6 className="font-medium flex items-center">
                        <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                        Device Information
                      </h6>
                      {selectedAlert.details.devices.map((device, index) => (
                        <div key={index} className="bg-white rounded p-3 border-l-4 border-orange-400">
                          <div className="flex items-center justify-between">
                            <span>{device.model}</span>
                            <span className="text-sm text-gray-500">{device.time}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            IP: {device.ip} • Type: {device.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedAlert.type === 'pattern_recognition' && (
                    <div className="space-y-4">
                      <h6 className="font-medium">Detected Patterns</h6>
                      <ul className="space-y-2">
                        {selectedAlert.details.patterns.map((pattern, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>{pattern}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-white rounded p-3">
                        <strong>Events Analyzed:</strong> {selectedAlert.details.eventsAnalyzed}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommended Actions */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h5 className="text-lg font-semibold mb-4">Recommended Actions</h5>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">1.</span>
                      <span>Contact the student for verification</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">2.</span>
                      <span>Review additional check-in data for patterns</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-2">3.</span>
                      <span>Consider implementing additional verification steps</span>
                    </div>
                    {selectedAlert.severity === 'high' && (
                      <div className="flex items-start">
                        <span className="text-red-500 mr-2">4.</span>
                        <span className="text-red-600 font-medium">Immediate investigation required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAlertDetails(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Mark as Resolved
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetection;
