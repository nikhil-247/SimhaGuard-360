import { CrowdZone, EmergencyUnit, RFIDDevice, Alert, PilgrimStats, EvacuationRoute } from '../types/dashboard';

export const mockCrowdZones: CrowdZone[] = [
  {
    id: 'triveni-sangam',
    name: 'Triveni Sangam',
    coordinates: { x: 375, y: 200, width: 50, height: 50 },
    currentCapacity: 42500,
    maxCapacity: 50000,
    status: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'dashashwamedh-ghat',
    name: 'Dashashwamedh Ghat',
    coordinates: { x: 200, y: 160, width: 80, height: 15 },
    currentCapacity: 14400,
    maxCapacity: 20000,
    status: 'moderate',
    lastUpdated: new Date()
  },
  {
    id: 'manikarnika-ghat',
    name: 'Manikarnika Ghat',
    coordinates: { x: 320, y: 165, width: 70, height: 15 },
    currentCapacity: 6750,
    maxCapacity: 15000,
    status: 'safe',
    lastUpdated: new Date()
  },
  {
    id: 'assi-ghat',
    name: 'Assi Ghat',
    coordinates: { x: 450, y: 160, width: 70, height: 15 },
    currentCapacity: 8200,
    maxCapacity: 18000,
    status: 'safe',
    lastUpdated: new Date()
  },
  {
    id: 'saraswati-ghat',
    name: 'Saraswati Ghat',
    coordinates: { x: 200, y: 310, width: 80, height: 15 },
    currentCapacity: 5600,
    maxCapacity: 12000,
    status: 'safe',
    lastUpdated: new Date()
  },
  {
    id: 'sector-1',
    name: 'Sector 1 Camping',
    coordinates: { x: 150, y: 250, width: 120, height: 80 },
    currentCapacity: 18500,
    maxCapacity: 25000,
    status: 'moderate',
    lastUpdated: new Date()
  },
  {
    id: 'sector-2',
    name: 'Sector 2 Camping',
    coordinates: { x: 350, y: 250, width: 120, height: 80 },
    currentCapacity: 12300,
    maxCapacity: 25000,
    status: 'safe',
    lastUpdated: new Date()
  },
  {
    id: 'sector-3',
    name: 'Sector 3 Camping',
    coordinates: { x: 550, y: 250, width: 120, height: 80 },
    currentCapacity: 15800,
    maxCapacity: 25000,
    status: 'safe',
    lastUpdated: new Date()
  }
];

export const mockEmergencyUnits: EmergencyUnit[] = [
  {
    id: 'medical-camp-1',
    type: 'medical',
    name: 'Medical Camp 1',
    coordinates: { x: 550, y: 180 },
    status: 'available',
    contact: '+91-9876543210'
  },
  {
    id: 'medical-camp-2',
    type: 'medical',
    name: 'Medical Camp 2',
    coordinates: { x: 250, y: 350 },
    status: 'available',
    contact: '+91-9876543211'
  },
  {
    id: 'police-post-1',
    type: 'police',
    name: 'Police Post 1',
    coordinates: { x: 350, y: 120 },
    status: 'available',
    contact: '+91-9876543212'
  },
  {
    id: 'police-post-2',
    type: 'police',
    name: 'Police Post 2',
    coordinates: { x: 500, y: 380 },
    status: 'busy',
    contact: '+91-9876543213'
  },
  {
    id: 'fire-station',
    type: 'fire',
    name: 'Fire Station',
    coordinates: { x: 150, y: 350 },
    status: 'available',
    contact: '+91-9876543214'
  },
  {
    id: 'rescue-team-1',
    type: 'rescue',
    name: 'Water Rescue Team 1',
    coordinates: { x: 380, y: 180 },
    status: 'available',
    contact: '+91-9876543215'
  },
  {
    id: 'rescue-team-2',
    type: 'rescue',
    name: 'Water Rescue Team 2',
    coordinates: { x: 420, y: 320 },
    status: 'available',
    contact: '+91-9876543216'
  }
];

export const mockRFIDDevices: RFIDDevice[] = [
  {
    id: 'rfid-001',
    wearerId: 'KM2025001',
    wearerName: 'Ravi Kumar Sharma',
    wearerAge: 8,
    guardianContact: '+91-9876543220',
    coordinates: { x: 390, y: 210 },
    lastSeen: new Date(),
    batteryLevel: 85,
    isDistressed: false
  },
  {
    id: 'rfid-002',
    wearerId: 'KM2025002',
    wearerName: 'Kamala Devi Gupta',
    wearerAge: 72,
    guardianContact: '+91-9876543221',
    coordinates: { x: 240, y: 170 },
    lastSeen: new Date(Date.now() - 300000),
    batteryLevel: 18,
    isDistressed: true
  },
  {
    id: 'rfid-003',
    wearerId: 'KM2025003',
    wearerName: 'Suresh Patel',
    wearerAge: 45,
    guardianContact: '+91-9876543222',
    coordinates: { x: 480, y: 170 },
    lastSeen: new Date(Date.now() - 120000),
    batteryLevel: 92,
    isDistressed: false
  },
  {
    id: 'rfid-004',
    wearerId: 'KM2025004',
    wearerName: 'Meera Singh',
    wearerAge: 35,
    guardianContact: '+91-9876543223',
    coordinates: { x: 200, y: 280 },
    lastSeen: new Date(Date.now() - 60000),
    batteryLevel: 67,
    isDistressed: false
  },
  {
    id: 'rfid-005',
    wearerId: 'KM2025005',
    wearerName: 'Arjun Yadav',
    wearerAge: 12,
    guardianContact: '+91-9876543224',
    coordinates: { x: 420, y: 240 },
    lastSeen: new Date(Date.now() - 900000),
    batteryLevel: 34,
    isDistressed: true
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'stampede',
    severity: 'critical',
    title: 'Critical Crowd Surge at Triveni Sangam',
    description: 'Extremely high crowd density detected at Triveni Sangam. Immediate evacuation and crowd control required.',
    location: 'Triveni Sangam',
    coordinates: { x: 400, y: 225 },
    timestamp: new Date(),
    isActive: true,
    estimatedResolutionTime: '30 minutes'
  },
  {
    id: 'alert-002',
    type: 'lost_person',
    severity: 'high',
    title: 'Missing Child - Arjun Yadav',
    description: 'RFID device shows child (12 years) missing for over 15 minutes. Last seen near Sector 2.',
    location: 'Sector 2 Camping Area',
    coordinates: { x: 420, y: 240 },
    timestamp: new Date(Date.now() - 180000),
    isActive: true,
    estimatedResolutionTime: '20 minutes'
  },
  {
    id: 'alert-003',
    type: 'medical',
    severity: 'high',
    title: 'Elderly Pilgrim in Distress',
    description: 'RFID alert: Elderly pilgrim (Kamala Devi, 72) showing distress signals. Low battery on device.',
    location: 'Dashashwamedh Ghat',
    coordinates: { x: 240, y: 170 },
    timestamp: new Date(Date.now() - 300000),
    isActive: true,
    estimatedResolutionTime: '10 minutes'
  },
  {
    id: 'alert-004',
    type: 'security',
    severity: 'medium',
    title: 'Suspicious Activity Report',
    description: 'Security personnel report suspicious behavior near Gate 3. Investigation in progress.',
    location: 'Gate 3 - Sector 2',
    coordinates: { x: 480, y: 70 },
    timestamp: new Date(Date.now() - 600000),
    isActive: true,
    estimatedResolutionTime: '25 minutes'
  },
  {
    id: 'alert-005',
    type: 'fire',
    severity: 'low',
    title: 'Small Fire Contained',
    description: 'Minor fire in food preparation area has been contained. No injuries reported.',
    location: 'Food Court - Sector 1',
    coordinates: { x: 215, y: 250 },
    timestamp: new Date(Date.now() - 1200000),
    isActive: false,
    estimatedResolutionTime: 'Resolved'
  }
];

export const mockPilgrimStats: PilgrimStats = {
  totalPilgrims: 2850000,
  currentInArea: 125000,
  peakToday: 145000,
  avgResponseTime: 3.8,
  activeIncidents: 4,
  resolvedIncidents: 47
};

export const mockEvacuationRoutes: EvacuationRoute[] = [
  {
    id: 'route-emergency-1',
    name: 'Sangam Emergency Exit',
    path: [
      { x: 400, y: 225 },
      { x: 350, y: 200 },
      { x: 250, y: 180 },
      { x: 150, y: 160 },
      { x: 120, y: 90 }
    ],
    capacity: 8000,
    estimatedTime: '12-18 minutes',
    status: 'clear'
  },
  {
    id: 'route-emergency-2',
    name: 'Sector 2 to Gate 6',
    path: [
      { x: 410, y: 290 },
      { x: 480, y: 320 },
      { x: 550, y: 350 },
      { x: 610, y: 380 },
      { x: 610, y: 420 }
    ],
    capacity: 5000,
    estimatedTime: '15-20 minutes',
    status: 'clear'
  },
  {
    id: 'route-emergency-3',
    name: 'Main Road Evacuation',
    path: [
      { x: 300, y: 250 },
      { x: 250, y: 200 },
      { x: 200, y: 150 },
      { x: 150, y: 100 },
      { x: 150, y: 80 }
    ],
    capacity: 12000,
    estimatedTime: '8-12 minutes',
    status: 'congested'
  },
  {
    id: 'route-emergency-4',
    name: 'VIP Gate Emergency Route',
    path: [
      { x: 500, y: 200 },
      { x: 550, y: 150 },
      { x: 600, y: 100 },
      { x: 610, y: 80 }
    ],
    capacity: 3000,
    estimatedTime: '6-10 minutes',
    status: 'clear'
  }
];