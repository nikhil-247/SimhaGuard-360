import React from 'react';
import { CrowdZone, EmergencyUnit, RFIDDevice, EvacuationRoute } from '../../types/dashboard';
import { CrowdHeatmap } from './CrowdHeatmap';
import { LocationMarkers } from './LocationMarkers';
import { EvacuationRoutes } from './EvacuationRoutes';

interface MapViewProps {
  crowdZones: CrowdZone[];
  emergencyUnits: EmergencyUnit[];
  rfidDevices: RFIDDevice[];
  evacuationRoutes: EvacuationRoute[];
  selectedZone?: string;
  onZoneSelect: (zoneId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  crowdZones,
  emergencyUnits,
  rfidDevices,
  evacuationRoutes,
  selectedZone,
  onZoneSelect
}) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Maha Kumbh 2025 - Live Event Map</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-300">Safe</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-300">Moderate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-300">Critical</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-slate-600 overflow-hidden">
        <svg
          width="100%"
          height="500"
          viewBox="0 0 800 500"
          className="bg-gradient-to-br from-slate-700 to-slate-800"
        >
          {/* River Ganga */}
          <path
            d="M 0 150 Q 200 130 400 150 T 800 170"
            stroke="#2563EB"
            strokeWidth="12"
            fill="none"
            opacity="0.8"
          />
          <text x="350" y="140" className="text-sm fill-blue-300 font-medium">River Ganga</text>

          {/* River Yamuna */}
          <path
            d="M 0 300 Q 200 280 400 300 T 800 320"
            stroke="#1D4ED8"
            strokeWidth="10"
            fill="none"
            opacity="0.7"
          />
          <text x="350" y="290" className="text-sm fill-blue-300 font-medium">River Yamuna</text>

          {/* Triveni Sangam */}
          <circle cx="400" cy="225" r="25" fill="#3B82F6" opacity="0.6" />
          <text x="430" y="230" className="text-sm fill-blue-200 font-bold">Triveni Sangam</text>

          {/* Main Roads */}
          <line x1="0" y1="80" x2="800" y2="80" stroke="#64748B" strokeWidth="4" />
          <text x="10" y="75" className="text-xs fill-slate-300">NH-2 Highway</text>
          
          <line x1="0" y1="420" x2="800" y2="420" stroke="#64748B" strokeWidth="4" />
          <text x="10" y="415" className="text-xs fill-slate-300">Yamuna Expressway</text>
          
          <line x1="150" y1="0" x2="150" y2="500" stroke="#64748B" strokeWidth="3" />
          <line x1="650" y1="0" x2="650" y2="500" stroke="#64748B" strokeWidth="3" />

          {/* Main Gates */}
          <g>
            <rect x="120" y="70" width="60" height="20" fill="#F59E0B" rx="3" />
            <text x="150" y="83" textAnchor="middle" className="text-xs fill-white font-bold">Gate 1</text>

            <rect x="250" y="70" width="60" height="20" fill="#F59E0B" rx="3" />
            <text x="280" y="83" textAnchor="middle" className="text-xs fill-white font-bold">Gate 2</text>

            <rect x="450" y="70" width="60" height="20" fill="#F59E0B" rx="3" />
            <text x="480" y="83" textAnchor="middle" className="text-xs fill-white font-bold">Gate 3</text>

            <rect x="580" y="70" width="60" height="20" fill="#EF4444" rx="3" />
            <text x="610" y="83" textAnchor="middle" className="text-xs fill-white font-bold">VIP Gate</text>

            <rect x="120" y="410" width="60" height="20" fill="#10B981" rx="3" />
            <text x="150" y="423" textAnchor="middle" className="text-xs fill-white font-bold">Emergency</text>

            <rect x="580" y="410" width="60" height="20" fill="#8B5CF6" rx="3" />
            <text x="610" y="423" textAnchor="middle" className="text-xs fill-white font-bold">Service</text>
          </g>

          {/* Sacred Ghats */}
          <g>
            <rect x="200" y="160" width="80" height="15" fill="#475569" rx="2" />
            <text x="240" y="172" textAnchor="middle" className="text-xs fill-slate-200">Dashashwamedh Ghat</text>

            <rect x="320" y="165" width="70" height="15" fill="#475569" rx="2" />
            <text x="355" y="177" textAnchor="middle" className="text-xs fill-slate-200">Manikarnika Ghat</text>

            <rect x="450" y="160" width="70" height="15" fill="#475569" rx="2" />
            <text x="485" y="172" textAnchor="middle" className="text-xs fill-slate-200">Assi Ghat</text>

            <rect x="200" y="310" width="80" height="15" fill="#475569" rx="2" />
            <text x="240" y="322" textAnchor="middle" className="text-xs fill-slate-200">Saraswati Ghat</text>
          </g>

          {/* Crowd Zones */}
          <CrowdHeatmap zones={crowdZones} selectedZone={selectedZone} onZoneSelect={onZoneSelect} />

          {/* Emergency Units and RFID Devices */}
          <LocationMarkers emergencyUnits={emergencyUnits} rfidDevices={rfidDevices} />

          {/* Evacuation Routes */}
          <EvacuationRoutes routes={evacuationRoutes} />

          {/* Key Landmarks */}
          <g>
            <circle cx="380" cy="200" r="8" fill="#10B981" />
            <text x="390" y="205" className="text-xs fill-green-300">Akshayavat</text>

            <circle cx="450" cy="250" r="8" fill="#F59E0B" />
            <text x="460" y="255" className="text-xs fill-yellow-300">Hanuman Temple</text>

            <rect x="100" y="200" width="20" height="20" fill="#8B5CF6" rx="3" />
            <text x="125" y="212" className="text-xs fill-purple-300">Command Center</text>

            <rect x="550" y="180" width="20" height="20" fill="#10B981" rx="3" />
            <text x="575" y="192" className="text-xs fill-emerald-300">Medical Camp 1</text>

            <rect x="250" y="350" width="20" height="20" fill="#10B981" rx="3" />
            <text x="275" y="362" className="text-xs fill-emerald-300">Medical Camp 2</text>

            <rect x="150" y="350" width="20" height="20" fill="#EF4444" rx="3" />
            <text x="175" y="362" className="text-xs fill-red-300">Fire Station</text>

            <rect x="350" y="120" width="20" height="20" fill="#3B82F6" rx="3" />
            <text x="375" y="132" className="text-xs fill-blue-300">Police Post 1</text>

            <rect x="500" y="380" width="20" height="20" fill="#3B82F6" rx="3" />
            <text x="525" y="392" className="text-xs fill-blue-300">Police Post 2</text>
          </g>

          {/* Sector Boundaries */}
          <g stroke="#64748B" strokeWidth="1" strokeDasharray="3,3" opacity="0.5">
            <line x1="300" y1="100" x2="300" y2="400" />
            <line x1="500" y1="100" x2="500" y2="400" />
            <text x="200" y="115" className="text-xs fill-slate-400">Sector 1</text>
            <text x="400" y="115" className="text-xs fill-slate-400">Sector 2</text>
            <text x="600" y="115" className="text-xs fill-slate-400">Sector 3</text>
          </g>
        </svg>

        {/* Live indicator */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>

        {/* Weather Info */}
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span>🌤️</span>
              <span>26°C</span>
              <span>•</span>
              <span>Clear</span>
            </div>
            <div className="text-slate-400 mt-1">Wind: 5 km/h NE</div>
          </div>
        </div>
      </div>
    </div>
  );
};