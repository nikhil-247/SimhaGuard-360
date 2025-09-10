import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { 
  Users, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Settings, 
  Database,
  TrendingUp,
  Shield,
  Activity,
  Clock
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const { 
    crowdZones, 
    emergencyUnits, 
    rfidDevices, 
    alerts, 
    users: systemUsers,
    loading 
  } = useSupabaseData();

  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalPilgrims: 2850000,
    currentInArea: 125000,
    activeAlerts: alerts?.filter(alert => alert.is_active).length || 0,
    emergencyUnits: emergencyUnits?.length || 0,
    crowdZones: crowdZones?.length || 0,
    rfidDevices: rfidDevices?.length || 0
  };

  const criticalAlerts = alerts?.filter(alert => 
    alert.is_active && alert.severity === 'critical'
  ) || [];

  const crowdedZones = crowdZones?.filter(zone => 
    zone.status === 'crowded' || zone.status === 'critical'
  ) || [];

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-600">Maha Kumbh Management System</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-500" />
            <span className="text-sm text-gray-600">System Status: Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Pilgrims</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.totalPilgrims / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Current in Area</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.currentInArea / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Crowd Zones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.crowdZones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Radio className="w-8 h-8 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">RFID Devices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rfidDevices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Emergency Units</p>
              <p className="text-2xl font-bold text-gray-900">{stats.emergencyUnits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-semibold text-red-900 ml-2">Critical Alerts</h2>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Location: {alert.location} • {new Date(alert.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {alert.severity.toUpperCase()}
                    </span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crowded Zones */}
      {crowdedZones.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            <h2 className="text-lg font-semibold text-yellow-900 ml-2">High Density Zones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crowdedZones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    zone.status === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {zone.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">
                      {zone.current_capacity?.toLocaleString()} / {zone.max_capacity?.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        zone.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (zone.current_capacity || 0) / (zone.max_capacity || 1) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.round((zone.current_capacity || 0) / (zone.max_capacity || 1) * 100)}% occupied
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-6 h-6 text-blue-500 mr-2" />
            <span className="font-medium">Manage Users</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Database className="w-6 h-6 text-green-500 mr-2" />
            <span className="font-medium">Database Monitor</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-6 h-6 text-purple-500 mr-2" />
            <span className="font-medium">System Settings</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
            <span className="font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}