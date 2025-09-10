import React, { useState, useEffect } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Cloud, 
  Clock,
  MapPin,
  Activity,
  Brain,
  Zap
} from 'lucide-react';

interface PredictiveAlert {
  id: string;
  type: 'crowd_surge' | 'weather_impact' | 'bottleneck' | 'resource_shortage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  probability: number;
  estimatedTime: string;
  suggestedActions: string[];
  affectedArea: string;
}

export default function PredictiveAlerts() {
  const { crowdZones, alerts, loading } = useSupabaseData();
  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<PredictiveAlert | null>(null);

  useEffect(() => {
    // Generate predictive alerts based on current data
    const generatePredictiveAlerts = () => {
      const predictions: PredictiveAlert[] = [];

      // Crowd surge prediction based on current capacity
      const highCapacityZones = crowdZones?.filter(zone => 
        (zone.current_capacity || 0) / (zone.max_capacity || 1) > 0.7
      ) || [];

      highCapacityZones.forEach(zone => {
        const capacityRatio = (zone.current_capacity || 0) / (zone.max_capacity || 1);
        if (capacityRatio > 0.85) {
          predictions.push({
            id: `crowd_${zone.id}`,
            type: 'crowd_surge',
            severity: capacityRatio > 0.95 ? 'critical' : 'high',
            title: `Potential Crowd Surge at ${zone.name}`,
            description: `Current capacity at ${Math.round(capacityRatio * 100)}%. Risk of dangerous overcrowding within next 30 minutes.`,
            location: zone.name,
            probability: Math.min(95, Math.round(capacityRatio * 100)),
            estimatedTime: '15-30 minutes',
            suggestedActions: [
              'Deploy additional crowd control personnel',
              'Activate alternative routes',
              'Issue crowd dispersal announcements',
              'Prepare emergency evacuation protocols'
            ],
            affectedArea: `${zone.name} and surrounding areas`
          });
        }
      });

      // Weather impact prediction
      predictions.push({
        id: 'weather_001',
        type: 'weather_impact',
        severity: 'medium',
        title: 'Weather-Related Crowd Movement',
        description: 'Temperature rising to 32°C. Expect increased movement towards shaded areas and water points.',
        location: 'All outdoor zones',
        probability: 78,
        estimatedTime: '2-3 hours',
        suggestedActions: [
          'Increase water distribution points',
          'Set up additional shade structures',
          'Monitor elderly and children closely',
          'Prepare heat exhaustion response teams'
        ],
        affectedArea: 'Triveni Sangam, Dashashwamedh Ghat'
      });

      // Bottleneck prediction
      predictions.push({
        id: 'bottleneck_001',
        type: 'bottleneck',
        severity: 'high',
        title: 'Traffic Bottleneck at Main Gate',
        description: 'Current entry rate exceeding optimal flow. Potential 45-minute delays expected.',
        location: 'Main Gate (Gate 1)',
        probability: 85,
        estimatedTime: '45-60 minutes',
        suggestedActions: [
          'Open additional entry points',
          'Deploy traffic management teams',
          'Implement queue management system',
          'Redirect incoming pilgrims to alternate gates'
        ],
        affectedArea: 'Main entrance and approach roads'
      });

      // Resource shortage prediction
      predictions.push({
        id: 'resource_001',
        type: 'resource_shortage',
        severity: 'medium',
        title: 'Medical Resource Strain',
        description: 'Current medical incidents trending 40% above normal. Potential resource shortage in 2 hours.',
        location: 'Medical Camp Alpha',
        probability: 65,
        estimatedTime: '1-2 hours',
        suggestedActions: [
          'Alert backup medical teams',
          'Redistribute medical supplies',
          'Prepare mobile medical units',
          'Coordinate with nearby hospitals'
        ],
        affectedArea: 'Central medical facilities'
      });

      setPredictiveAlerts(predictions);
    };

    generatePredictiveAlerts();
    const interval = setInterval(generatePredictiveAlerts, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [crowdZones, alerts]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crowd_surge': return <Users className="w-5 h-5" />;
      case 'weather_impact': return <Cloud className="w-5 h-5" />;
      case 'bottleneck': return <Activity className="w-5 h-5" />;
      case 'resource_shortage': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
              <p className="text-gray-600">AI-powered crowd management insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">AI Engine: Active</span>
          </div>
        </div>
      </div>

      {/* Predictive Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictiveAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`bg-white rounded-lg shadow-sm border-l-4 p-6 cursor-pointer hover:shadow-md transition-shadow ${
              alert.severity === 'critical' ? 'border-red-500' :
              alert.severity === 'high' ? 'border-orange-500' :
              alert.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
            }`}
            onClick={() => setSelectedAlert(alert)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  {getTypeIcon(alert.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{alert.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{alert.probability}%</div>
                <div className="text-xs text-gray-500">Probability</div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{alert.description}</p>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity.toUpperCase()}
              </span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">View Details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${getSeverityColor(selectedAlert.severity)}`}>
                    {getTypeIcon(selectedAlert.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedAlert.title}</h2>
                    <p className="text-gray-600">{selectedAlert.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{selectedAlert.probability}%</div>
                  <div className="text-sm text-gray-600">Probability</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-900">{selectedAlert.estimatedTime}</div>
                  <div className="text-sm text-gray-600">Time Frame</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">Severity Level</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedAlert.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Affected Area</h3>
                <p className="text-gray-700">{selectedAlert.affectedArea}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Suggested Actions</h3>
                <div className="space-y-2">
                  {selectedAlert.suggestedActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Implement Actions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}