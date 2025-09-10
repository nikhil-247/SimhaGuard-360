import React, { useState } from 'react';
import { Search, User, Battery, Clock, AlertTriangle, Phone } from 'lucide-react';
import { RFIDDevice } from '../../types/dashboard';

interface RFIDTrackerProps {
  devices: RFIDDevice[];
}

export const RFIDTracker: React.FC<RFIDTrackerProps> = ({ devices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<RFIDDevice | null>(null);

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
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffMinutes / 60)}h ago`;
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">RFID Tracker</h2>
        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-sm">
          {devices.length} Active
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Device List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            onClick={() => setSelectedDevice(device)}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              device.isDistressed
                ? 'border-red-500 bg-red-500/20 hover:bg-red-500/30'
                : 'border-slate-600 bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{device.wearerName}</span>
                <span className="text-xs text-slate-400">({device.wearerAge}y)</span>
                {device.isDistressed && (
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </div>
              <span className="text-xs text-slate-400">{device.wearerId}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Battery className={`w-3 h-3 ${getBatteryColor(device.batteryLevel)}`} />
                  <span className={`text-xs ${getBatteryColor(device.batteryLevel)}`}>
                    {Math.round(device.batteryLevel)}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">
                    {getLastSeenText(device.lastSeen)}
                  </span>
                </div>
              </div>
              {device.guardianContact && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Guardian</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Device Details */}
      {selectedDevice && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Device Details</h3>
            <button
              onClick={() => setSelectedDevice(null)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-white">
                {selectedDevice.coordinates.x}, {selectedDevice.coordinates.y}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Battery:</span>
              <span className={getBatteryColor(selectedDevice.batteryLevel)}>
                {Math.round(selectedDevice.batteryLevel)}%
              </span>
            </div>
            {selectedDevice.guardianContact && (
              <div className="flex justify-between">
                <span className="text-slate-400">Guardian:</span>
                <span className="text-white">{selectedDevice.guardianContact}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={selectedDevice.isDistressed ? 'text-red-400' : 'text-green-400'}>
                {selectedDevice.isDistressed ? 'Distressed' : 'Safe'}
              </span>
            </div>
          </div>
          {selectedDevice.isDistressed && (
            <button className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              Send Immediate Help
            </button>
          )}
        </div>
      )}
    </div>
  );
};