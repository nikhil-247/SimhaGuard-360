import React from 'react';
import { Activity, AlertTriangle, Clock, Database, MapPin, Radio, Shield, Users } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export default function AdminPanel() {
  const {
    crowdZones,
    emergencyUnits,
    rfidDevices,
    alerts,
    users,
    stats,
    lastUpdate,
    loading,
    fetchAllData
  } = useSupabaseData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  const criticalAlerts = alerts.filter(alert => alert.isActive && alert.severity === 'critical');
  const activeAlerts = alerts.filter(alert => alert.isActive);
  const crowdedZones = crowdZones
    .map(zone => ({
      ...zone,
      occupancy: zone.maxCapacity > 0 ? (zone.currentCapacity / zone.maxCapacity) * 100 : 0
    }))
    .filter(zone => zone.occupancy >= 70)
    .sort((a, b) => b.occupancy - a.occupancy);

  const availableUnits = emergencyUnits.filter(unit => unit.status === 'available').length;
  const activeDistress = rfidDevices.filter(device => device.isDistressed).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-orange-600 font-semibold">Operations / Admin</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">SimhaGuard Control Room</h1>
            <p className="text-gray-600">Measured operational state from Supabase. Demo geometry is visual only.</p>
          </div>
          <button
            onClick={() => void fetchAllData()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh snapshot
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">Last refresh: {lastUpdate.toLocaleTimeString()}</p>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Critical incidents require review</h2>
          </div>
          <div className="space-y-2">
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-lg border border-red-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.location} · {alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{alert.severity.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {[
          { label: 'Tracked devices', value: stats.totalPilgrims, icon: Radio },
          { label: 'Current in area', value: stats.currentInArea, icon: Activity },
          { label: 'Active incidents', value: stats.activeIncidents, icon: AlertTriangle },
          { label: 'Resolved today', value: stats.resolvedIncidents, icon: Shield },
          { label: 'Available units', value: availableUnits, icon: Users },
          { label: 'RFID distress', value: activeDistress, icon: MapPin }
        ].map(item => (
          <div key={item.label} className="bg-white rounded-lg shadow-sm p-4">
            <item.icon className="w-5 h-5 text-slate-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
            <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">High-density zones</h2>
          </div>
          <div className="space-y-3">
            {crowdedZones.length === 0 && <p className="text-sm text-gray-500">No zones above 70% occupancy.</p>}
            {crowdedZones.slice(0, 6).map(zone => (
              <div key={zone.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{zone.name}</span>
                  <span className={zone.occupancy >= 90 ? 'text-red-600 font-semibold' : 'text-yellow-700 font-semibold'}>
                    {zone.occupancy.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={zone.occupancy >= 90 ? 'h-full bg-red-500' : 'h-full bg-yellow-500'}
                    style={{ width: Math.min(100, zone.occupancy) + '%' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {zone.currentCapacity.toLocaleString()} / {zone.maxCapacity.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Operational health</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">Measured avg response</span>
              <strong className="text-gray-900">{stats.avgResponseTime.toFixed(1)} min</strong>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">Active alerts</span>
              <strong className="text-gray-900">{activeAlerts.length}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">Tracked RFID records</span>
              <strong className="text-gray-900">{rfidDevices.length}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Admin users visible</span>
              <strong className="text-gray-900">{users.length}</strong>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
              <Clock className="w-4 h-4 shrink-0" />
              Response time is derived from incident created/resolved timestamps. Empty history yields 0.0 rather than a fabricated value.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
