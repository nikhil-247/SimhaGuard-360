import React from 'react';
import { CrowdZone } from '../../types/dashboard';

interface CrowdHeatmapProps {
  zones: CrowdZone[];
  selectedZone?: string;
  onZoneSelect: (zoneId: string) => void;
}

export const CrowdHeatmap: React.FC<CrowdHeatmapProps> = ({ zones, selectedZone, onZoneSelect }) => {
  const getZoneColor = (zone: CrowdZone) => {
    const opacity = selectedZone === zone.id ? 0.8 : 0.6;
    switch (zone.status) {
      case 'safe': return `rgba(34, 197, 94, ${opacity})`;
      case 'moderate': return `rgba(234, 179, 8, ${opacity})`;
      case 'critical': return `rgba(239, 68, 68, ${opacity})`;
    }
  };

  const getStrokeColor = (zone: CrowdZone) => {
    if (selectedZone === zone.id) return '#ffffff';
    switch (zone.status) {
      case 'safe': return '#16a34a';
      case 'moderate': return '#ca8a04';
      case 'critical': return '#dc2626';
    }
  };

  return (
    <g>
      {zones.map((zone) => (
        <g key={zone.id}>
          <rect
            x={zone.coordinates.x}
            y={zone.coordinates.y}
            width={zone.coordinates.width}
            height={zone.coordinates.height}
            fill={getZoneColor(zone)}
            stroke={getStrokeColor(zone)}
            strokeWidth={selectedZone === zone.id ? 2 : 1}
            rx="4"
            className="cursor-pointer transition-all duration-200 hover:opacity-80"
            onClick={() => onZoneSelect(zone.id)}
          />
          <text
            x={zone.coordinates.x + zone.coordinates.width / 2}
            y={zone.coordinates.y + zone.coordinates.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-white font-medium pointer-events-none"
          >
            {zone.name}
          </text>
          <text
            x={zone.coordinates.x + zone.coordinates.width / 2}
            y={zone.coordinates.y + zone.coordinates.height / 2 + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-white opacity-90 pointer-events-none"
          >
            {Math.round((zone.currentCapacity / zone.maxCapacity) * 100)}%
          </text>
        </g>
      ))}
    </g>
  );
};