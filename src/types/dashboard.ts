export interface MapCoordinate {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface CrowdZone {
  id: string;
  name: string;
  coordinates: MapCoordinate;
  currentCapacity: number;
  maxCapacity: number;
  status: 'safe' | 'moderate' | 'critical' | 'closed';
  lastUpdated: Date;
}

export interface EmergencyUnit {
  id: string;
  type: 'medical' | 'police' | 'rescue' | 'fire';
  name: string;
  coordinates: { x: number; y: number };
  status: 'available' | 'busy' | 'offline';
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

export type AlertType =
  | 'crowd'
  | 'stampede'
  | 'fire'
  | 'flood'
  | 'medical'
  | 'lost_person'
  | 'security'
  | 'weather'
  | 'system';

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  coordinates: { x: number; y: number };
  timestamp: Date;
  isActive: boolean;
  estimatedResolutionTime?: number;
  createdBy?: string | null;
  resolvedBy?: string | null;
  resolvedAt?: Date | null;
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
  role: 'admin' | 'user';
  department: string;
  permissions: string[];
  isOnline: boolean;
}
