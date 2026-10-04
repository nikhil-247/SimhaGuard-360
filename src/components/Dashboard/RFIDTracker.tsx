import React, { useState } from 'react';
import { Search, User, Battery, Clock, AlertTriangle, Phone, ShieldCheck } from 'lucide-react';
import { RFIDDevice } from '../../types/dashboard';

interface RFIDTrackerProps {
  devices: RFIDDevice[];
  onDistress: (device: RFIDDevice, distressed?: boolean) => Promise<boolean> | boolean;
}

export const RFIDTracker: React.FC<RFIDTrackerProps> = ({ devices, onDistress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<RFIDDevice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const filteredDevices = devices.filter(device =>
    device.wearerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.wearerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-400';
    if (level > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLastSeenText = (lastSeen: Date) => {
    const diffMinutes = Math.floor((Date.now() - lastSeen.getTime()) / 60000);
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffMinutes / 60)}h ago`;
  };

  const handleDistress = async () => {
    if (!selectedDevice) return;
    setSubmitting(true);
    setMessage('');
    const ok = await onDistress(selectedDevice, !selectedDevice.isDistressed);
    setMessage(
      ok
        ? (selectedDevice.isDistressed ? 'Assistance flag cleared.' : 'Assistance alert created and device marked distressed.')
        : 'Operation failed. Check your operations permissions.'
    );
    setSubmitting(false);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">RFID Safety Tracking</h2>
        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-sm">
          {devices.length} tracked
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-slate-300">
          Operational data is visible only to authorized operations users. Distress actions create an auditable incident.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or RFID ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredDevices.map(device => (
          <button
            type="button"
            key={device.id}
            onClick={() => { setSelectedDevice(device); setMessage(''); }}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              device.isDistressed
                ? 'border-red-500 bg-red-500/20 hover:bg-red-500/30'
                : 'border-slate-600 bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{device.wearerName}</span>
                <span className="text-xs text-slate-400">({device.wearerAge}y)</span>
                {device.isDistressed && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
              </div>
              <span className="text-xs text-slate-400">{device.wearerId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Battery className={`w-3 h-3 ${getBatteryColor(device.batteryLevel)}`} />
                  <span className={`text-xs ${getBatteryColor(device.batteryLevel)}`}>{Math.round(device.batteryLevel)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">{getLastSeenText(device.lastSeen)}</span>
                </div>
              </div>
              {device.guardianContact && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Guardian linked</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedDevice && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Tracking record</h3>
            <button onClick={() => setSelectedDevice(null)} className="text-slate-400 hover:text-white">×</button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Location:</span><span className="text-white">{Math.round(selectedDevice.coordinates.x)}, {Math.round(selectedDevice.coordinates.y)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Battery:</span><span className={getBatteryColor(selectedDevice.batteryLevel)}>{Math.round(selectedDevice.batteryLevel)}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Last seen:</span><span className="text-white">{getLastSeenText(selectedDevice.lastSeen)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className={selectedDevice.isDistressed ? 'text-red-400' : 'text-green-400'}>{selectedDevice.isDistressed ? 'Distress active' : 'Normal'}</span></div>
          </div>
          {selectedDevice.guardianContact && (
            <p className="mt-3 text-xs text-slate-400">Guardian contact is protected operational data and is not rendered here by default.</p>
          )}
          {message && <p className="mt-3 text-xs text-emerald-300">{message}</p>}
          <button
            onClick={handleDistress}
            disabled={submitting}
            className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
              selectedDevice.isDistressed ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {submitting ? 'Updating…' : selectedDevice.isDistressed ? 'Clear assistance flag' : 'Mark distress + create alert'}
          </button>
        </div>
      )}

      {filteredDevices.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">No matching tracked devices.</div>
      )}
    </div>
  );
};
