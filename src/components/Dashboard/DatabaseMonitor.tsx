import React from 'react';
import { Activity, Database, Radio, ShieldCheck, Users, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export default function DatabaseMonitor() {
  const {
    crowdZones,
    emergencyUnits,
    rfidDevices,
    alerts,
    users,
    lastUpdate,
    loading,
    fetchAllData
  } = useSupabaseData();

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const staleZones = crowdZones.filter(zone => Date.now() - zone.lastUpdated.getTime() > 5 * 60 * 1000);
  const offlineUnits = emergencyUnits.filter(unit => unit.status === 'offline');
  const distressed = rfidDevices.filter(device => device.isDistressed);

  const tables = [
    { name: 'users', records: users.length, access: 'Admin only' },
    { name: 'crowd_zones', records: crowdZones.length, access: 'Authenticated' },
    { name: 'emergency_units', records: emergencyUnits.length, access: 'Authenticated' },
    { name: 'rfid_devices', records: rfidDevices.length, access: 'Operations' },
    { name: 'alerts', records: alerts.length, access: 'Operations / Admin' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Health</h1>
              <p className="text-gray-600">Measured application data health, freshness and access posture.</p>
            </div>
          </div>
          <button
            onClick={() => void fetchAllData()}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-4 h-4 text-green-500" />
          Last successful UI refresh: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Tracked records', value: crowdZones.length + emergencyUnits.length + rfidDevices.length + alerts.length + users.length, icon: Database },
          { title: 'Active incidents', value: activeAlerts.length, icon: AlertTriangle },
          { title: 'RFID distress', value: distressed.length, icon: Radio },
          { title: 'Stale crowd zones', value: staleZones.length, icon: Clock }
        ].map(metric => (
          <div key={metric.title} className="bg-white rounded-lg shadow-sm p-5">
            <metric.icon className="w-5 h-5 text-slate-500 mb-3" />
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">Critical incidents</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{criticalAlerts.length}</p>
          <p className="text-sm text-gray-500 mt-1">{criticalAlerts.length ? 'Operator review required.' : 'No critical incidents currently active.'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">Offline response units</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{offlineUnits.length}</p>
          <p className="text-sm text-gray-500 mt-1">Derived directly from stored unit status.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">Access posture</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">RLS</p>
          <p className="text-sm text-gray-500 mt-1">Sensitive RFID access is restricted to operations roles.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Data access and freshness</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-gray-500">Table</th>
              <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-gray-500">Records loaded</th>
              <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-gray-500">Access boundary</th>
              <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-gray-500">Health</th>
            </tr></thead>
            <tbody>
              {tables.map(table => (
                <tr key={table.name} className="border-b border-gray-100">
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{table.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-700">{table.records.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{table.access}</td>
                  <td className="px-3 py-3 text-sm text-green-600">Loaded</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {staleZones.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
            {staleZones.length} crowd-zone records are older than five minutes. Treat those readings as stale until refreshed.
          </div>
        )}
      </div>
    </div>
  );
}
