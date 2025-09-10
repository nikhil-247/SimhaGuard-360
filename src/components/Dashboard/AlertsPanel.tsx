import React from 'react';
import { AlertTriangle, Clock, MapPin, X, CheckCircle } from 'lucide-react';
import { Alert } from '../../types/dashboard';

interface AlertsPanelProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onResolveAlert }) => {
  const activeAlerts = alerts.filter(alert => alert.isActive);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/20 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/20 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/20 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-500/20 text-blue-400';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'stampede': return '🚨';
      case 'fire': return '🔥';
      case 'flood': return '🌊';
      case 'medical': return '🏥';
      case 'lost_person': return '👤';
      case 'security': return '🔒';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-sm font-medium">
          {activeAlerts.length}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p>No active alerts</p>
            <p className="text-sm">All systems operating normally</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${getSeverityColor(alert.severity)} hover:bg-opacity-30 transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white">{alert.title}</h3>
                      <span className="text-xs uppercase px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                      {alert.estimatedResolutionTime && (
                        <span className="text-yellow-400">ETA: {alert.estimatedResolutionTime}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                  title="Mark as resolved"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};