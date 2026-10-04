import React, { useMemo, useState } from 'react';
import { AlertTriangle, Activity, Brain, Clock, MapPin, Radio, ShieldCheck, Users } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface RiskSignal {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  location: string;
  score: number;
  basis: string;
  actions: string[];
}

const severityForScore = (score: number): RiskSignal['severity'] => {
  if (score >= 90) return 'critical';
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

const severityClasses: Record<RiskSignal['severity'], string> = {
  critical: 'text-red-600 bg-red-100 border-red-200',
  high: 'text-orange-600 bg-orange-100 border-orange-200',
  medium: 'text-yellow-700 bg-yellow-100 border-yellow-200',
  low: 'text-blue-600 bg-blue-100 border-blue-200',
};

export default function PredictiveAlerts() {
  const { crowdZones, alerts, rfidDevices, loading } = useSupabaseData();
  const [selected, setSelected] = useState<RiskSignal | null>(null);

  const signals = useMemo<RiskSignal[]>(() => {
    const result: RiskSignal[] = [];

    crowdZones.forEach(zone => {
      const occupancy = zone.maxCapacity > 0
        ? (zone.currentCapacity / zone.maxCapacity) * 100
        : 0;

      if (occupancy >= 50) {
        const score = Math.round(Math.min(100, occupancy));
        result.push({
          id: `density-${zone.id}`,
          severity: severityForScore(score),
          title: `Density threshold at ${zone.name}`,
          location: zone.name,
          score,
          basis: `${Math.round(occupancy)}% of configured capacity is currently occupied.`,
          actions: score >= 90
            ? ['Restrict inflow at the affected zone', 'Verify alternate route capacity', 'Create or escalate an incident if conditions persist']
            : ['Monitor the next refresh', 'Check nearby zone capacity', 'Prepare flow-control measures if occupancy rises'],
        });
      }
    });

    const activeCritical = alerts.filter(a => a.isActive && a.severity === 'critical').length;
    const activeHigh = alerts.filter(a => a.isActive && a.severity === 'high').length;
    const incidentScore = Math.min(100, activeCritical * 50 + activeHigh * 25);
    if (incidentScore > 0) {
      result.push({
        id: 'incident-load',
        severity: severityForScore(incidentScore),
        title: 'Active incident load',
        location: 'Command Center',
        score: incidentScore,
        basis: `${activeCritical} critical and ${activeHigh} high-severity incidents are active.`,
        actions: ['Review the incident queue', 'Assign owners to unresolved incidents', 'Measure response time after resolution'],
      });
    }

    const distressed = rfidDevices.filter(device => device.isDistressed).length;
    if (distressed > 0) {
      const score = Math.min(100, 55 + distressed * 15);
      result.push({
        id: 'rfid-distress',
        severity: severityForScore(score),
        title: 'Tracked-person assistance signals',
        location: 'RFID operations',
        score,
        basis: `${distressed} tracked device${distressed === 1 ? '' : 's'} are currently marked distressed.`,
        actions: ['Open the RFID safety workflow', 'Verify the last-seen location', 'Create or review the linked assistance incident'],
      });
    }

    const now = Date.now();
    const staleZones = crowdZones.filter(zone => now - zone.lastUpdated.getTime() > 5 * 60 * 1000).length;
    if (staleZones > 0) {
      const score = Math.min(85, 40 + staleZones * 10);
      result.push({
        id: 'data-freshness',
        severity: severityForScore(score),
        title: 'Crowd telemetry freshness degraded',
        location: 'Data pipeline',
        score,
        basis: `${staleZones} crowd zone record${staleZones === 1 ? '' : 's'} have not refreshed within 5 minutes.`,
        actions: ['Check the realtime subscription status', 'Verify upstream telemetry', 'Do not use stale zones for autonomous decisions'],
      });
    }

    return result.sort((a, b) => b.score - a.score);
  }, [alerts, crowdZones, rfidDevices]);

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
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operational Risk Signals</h1>
            <p className="text-gray-600">Transparent rules over live operational data, not an AI probability claim.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">Capacity thresholds</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">Incident load</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">RFID distress</span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">Data freshness</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {signals.map(signal => (
          <button
            type="button"
            key={signal.id}
            onClick={() => setSelected(signal)}
            className="text-left bg-white rounded-lg shadow-sm border-l-4 border-slate-300 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg border ${severityClasses[signal.severity]}`}>
                  {signal.id.startsWith('density') ? <Users className="w-5 h-5" /> :
                   signal.id === 'incident-load' ? <AlertTriangle className="w-5 h-5" /> :
                   signal.id === 'rfid-distress' ? <Radio className="w-5 h-5" /> :
                   <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{signal.title}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{signal.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{signal.score}</div>
                <div className="text-xs text-gray-500">risk score</div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{signal.basis}</p>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityClasses[signal.severity]}`}>
                {signal.severity.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">View control basis</span>
            </div>
          </button>
        ))}

        {!signals.length && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-10 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto text-green-500 mb-3" />
            <p className="font-semibold text-gray-900">No operational risk signals above threshold.</p>
            <p className="text-sm text-gray-500 mt-1">The engine is evaluating live records and data freshness.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
                <p className="text-gray-600">{selected.location} · score {selected.score}/100</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Basis</div>
                <div className="font-medium text-gray-900 mt-1">{selected.basis}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Severity</div>
                <div className="font-medium text-gray-900 mt-1">{selected.severity.toUpperCase()}</div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3">Recommended operator actions</h3>
            <div className="space-y-2">
              {selected.actions.map((action, index) => (
                <div key={action} className="flex gap-3 items-start">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{index + 1}</span>
                  <span className="text-gray-700">{action}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg border border-amber-200 bg-amber-50 flex gap-2">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                This is a transparent operational rule signal. It does not predict future events and must not be treated as an autonomous emergency decision.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
