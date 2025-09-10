export interface CrowdZone {
  id: string;
  name: string;
  coordinates: { x: number; y: number; width: number; height: number };
  currentCapacity: number;
  maxCapacity: number;
  status: 'safe' | 'moderate' | 'critical';
  lastUpdated: Date;
}

export interface EmergencyUnit {
  id: string;
  type: 'medical' | 'police' | 'rescue' | 'fire';
  name: string;
  coordinates: { x: number; y: number };
  status: 'available' | 'busy' | 'emergency';
  contact: string;
}

export interface RFIDDevice {
  id: string;
  wearerId: string;
  wearerName: string;
  wearerAge: number;
  guardianContact?: string;
  coordinates: { x: number; y: number };
  lastSeen: Date;
  batteryLevel: number;
  isDistressed: boolean;
}

export interface Alert {
  id: string;
  type: 'stampede' | 'fire' | 'flood' | 'medical' | 'lost_person' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  coordinates: { x: number; y: number };
  timestamp: Date;
  isActive: boolean;
  estimatedResolutionTime?: string;
}

export interface PilgrimStats {
  totalPilgrims: number;
  currentInArea: number;
  peakToday: number;
  avgResponseTime: number;
  activeIncidents: number;
  resolvedIncidents: number;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  path: { x: number; y: number }[];
  capacity: number;
  estimatedTime: string;
  status: 'clear' | 'congested' | 'blocked';
}

export interface UserRole {
  id: string;
  name: string;
  role: 'admin' | 'medical' | 'security' | 'volunteer';
  department: string;
  permissions: string[];
  isOnline: boolean;
}