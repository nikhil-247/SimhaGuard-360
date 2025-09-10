import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import {
  Users,
  AlertTriangle,
  MapPin,
  Radio,
  Activity,
  Shield,
  Navigation
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const {
    crowdZones,
    emergencyUnits,
    rfidDevices,
    alerts,
    loading
  } = useSupabaseData();

  const stats = {
    totalPilgrims: 2850000,
    currentInArea: 125000,
    activeAlerts: alerts?.filter((alert: any) => alert.isActive).length || 0,
    emergencyUnits: emergencyUnits?.filter((unit: any) => unit.status === 'available').length || 0,
    crowdZones: crowdZones?.length || 0,
    rfidDevices: rfidDevices?.filter((device: any) => !device.isDistressed).length || 0
  };

  const recentAlerts = alerts
    ? alerts
        .filter((alert: any) => alert.isActive)
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5)
    : [];

  const crowdedZones = crowdZones
    ? crowdZones
        .filter(
          (zone: any) =>
            zone.status === 'critical' || zone.status === 'moderate'
        )
        .slice(0, 4)
    : [];

  const distressedDevices = rfidDevices
    ? rfidDevices.filter((device: any) => device.isDistressed)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.user_metadata?.full_name || 'User'}</h1>
            <p className="opacity-90">Maha Kumbh Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <span className="text-sm">System Active</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
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
              <p className="text-sm font-medium text-gray-600">RFID Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rfidDevices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distress Alerts */}
      {distressedDevices.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-semibold text-red-900 ml-2">Distress Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distressedDevices.map((device: any) => (
              <div key={device.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{device.wearerName || device.wearer_name}</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    DISTRESS
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Age: {device.wearerAge} years</p>
                  <p>Contact: {device.guardianContact}</p>
                  <p>Last Seen: {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString() : 'N/A'}</p>
                  <p>Battery: {device.batteryLevel}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
        {recentAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAlerts.map((alert: any) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{alert.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{alert.location}</span>
                  <span>{alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No active alerts</p>
        )}
      </div>

      {/* Crowded Zones */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Crowded Zones</h2>
        {crowdedZones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crowdedZones.map((zone: any) => (
              <div key={zone.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{zone.name}</h3>
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
        ) : (
          <p className="text-gray-500 text-center py-4">All zones operating normally</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="w-6 h-6 text-blue-500 mr-2" />
            <span className="font-medium">View Map</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <span className="font-medium">Report Alert</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Radio className="w-6 h-6 text-green-500 mr-2" />
            <span className="font-medium">RFID Tracker</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Navigation className="w-6 h-6 text-purple-500 mr-2" />
            <span className="font-medium">Emergency Routes</span>
          </button>
        </div>
      </div>
    </div>
  );
}