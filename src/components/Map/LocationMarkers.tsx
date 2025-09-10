import React from 'react';
import { EmergencyUnit, RFIDDevice } from '../../types/dashboard';

interface LocationMarkersProps {
  emergencyUnits: EmergencyUnit[];
  rfidDevices: RFIDDevice[];
}

export const LocationMarkers: React.FC<LocationMarkersProps> = ({ emergencyUnits, rfidDevices }) => {
  const getUnitColor = (unit: EmergencyUnit) => {
    switch (unit.type) {
      case 'medical': return '#10B981';
      case 'police': return '#3B82F6';
      case 'rescue': return '#F59E0B';
      case 'fire': return '#EF4444';
    }
  };

  const getUnitSymbol = (unit: EmergencyUnit) => {
    switch (unit.type) {
      case 'medical': return '+';
      case 'police': return '👮';
      case 'rescue': return '🛟';
      case 'fire': return '🚒';
    }
  };

  const getStatusColor = (status: EmergencyUnit['status']) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'emergency': return '#EF4444';
    }
  };

  return (
    <g>
      {/* Emergency Units */}
      {emergencyUnits.map((unit) => (
        <g key={unit.id}>
          <circle
            cx={unit.coordinates.x}
            cy={unit.coordinates.y}
            r="12"
            fill={getUnitColor(unit)}
            stroke={getStatusColor(unit.status)}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
          />
          <text
            x={unit.coordinates.x}
            y={unit.coordinates.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-white font-bold pointer-events-none"
          >
            {unit.type === 'medical' ? '+' : unit.type.charAt(0).toUpperCase()}
          </text>
          {unit.status === 'emergency' && (
            <circle
              cx={unit.coordinates.x}
              cy={unit.coordinates.y}
              r="18"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </g>
      ))}

      {/* RFID Devices */}
      {rfidDevices.map((device) => (
        <g key={device.id}>
          <circle
            cx={device.coordinates.x}
            cy={device.coordinates.y}
            r="6"
            fill={device.isDistressed ? '#EF4444' : '#8B5CF6'}
            stroke={device.batteryLevel < 20 ? '#F59E0B' : '#ffffff'}
            strokeWidth="1"
            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
          />
          {device.isDistressed && (
            <circle
              cx={device.coordinates.x}
              cy={device.coordinates.y}
              r="12"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              className="animate-ping"
            />
          )}
          {device.batteryLevel < 20 && (
            <text
              x={device.coordinates.x + 10}
              y={device.coordinates.y - 5}
              className="text-xs fill-yellow-400 font-bold"
            >
              ⚡
            </text>
          )}
        </g>
      ))}

      {/* Family Meeting Points */}
      <g>
        <rect x="150" y="350" width="20" height="20" fill="#8B5CF6" rx="4" />
        <text x="160" y="362" textAnchor="middle" className="text-xs fill-white font-bold">F</text>
        <text x="175" y="365" className="text-xs fill-purple-300">Family Point 1</text>

        <rect x="320" y="50" width="20" height="20" fill="#8B5CF6" rx="4" />
        <text x="330" y="62" textAnchor="middle" className="text-xs fill-white font-bold">F</text>
        <text x="345" y="65" className="text-xs fill-purple-300">Family Point 2</text>
      </g>

      {/* Lost & Found Centers */}
      <g>
        <rect x="450" y="150" width="20" height="20" fill="#EC4899" rx="4" />
        <text x="460" y="162" textAnchor="middle" className="text-xs fill-white font-bold">L</text>
        <text x="425" y="145" className="text-xs fill-pink-300">Lost & Found</text>
      </g>
    </g>
  );
};