import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CrowdZone, EmergencyUnit, RFIDDevice, Alert, PilgrimStats, UserRole } from '../types/dashboard';
import { useAuth } from '../contexts/AuthContext';
import { toMapCoordinate } from '../lib/geo';

const mapCrowdStatus = (status: string): CrowdZone['status'] => {
  if (status === 'critical') return 'critical';
  if (status === 'crowded') return 'moderate';
  if (status === 'closed') return 'closed';
  return 'safe';
};

const mapUnitType = (type: string): EmergencyUnit['type'] => {
  if (type === 'security') return 'police';
  if (type === 'fire') return 'fire';
  if (type === 'rescue') return 'rescue';
  return 'medical';
};

const mapUnitStatus = (status: string): EmergencyUnit['status'] => {
  if (status === 'busy') return 'busy';
  if (status === 'offline') return 'offline';
  return 'available';
};

const mapAlertType = (type: string): Alert['type'] => {
  const allowed: Alert['type'][] = [
    'crowd', 'stampede', 'fire', 'flood', 'medical', 'lost_person',
    'security', 'weather', 'system'
  ];
  return allowed.includes(type as Alert['type']) ? (type as Alert['type']) : 'system';
};

export const useSupabaseData = () => {
  const { user, profile } = useAuth();
  const [crowdZones, setCrowdZones] = useState<CrowdZone[]>([]);
  const [emergencyUnits, setEmergencyUnits] = useState<EmergencyUnit[]>([]);
  const [rfidDevices, setRFIDDevices] = useState<RFIDDevice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [users, setUsers] = useState<UserRole[]>([]);
  const [stats, setStats] = useState<PilgrimStats>({
    totalPilgrims: 0,
    currentInArea: 0,
    peakToday: 0,
    avgResponseTime: 0,
    activeIncidents: 0,
    resolvedIncidents: 0
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const calculateStats = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        pilgrimResult,
        zoneResult,
        activeResult,
        resolvedResult
      ] = await Promise.all([
        supabase.from('rfid_devices').select('*', { count: 'exact', head: true }),
        supabase.from('crowd_zones').select('current_capacity'),
        supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase
          .from('alerts')
          .select('created_at,resolved_at')
          .eq('is_active', false)
          .gte('resolved_at', today.toISOString())
          .not('resolved_at', 'is', null)
      ]);

      const currentInArea =
        zoneResult.data?.reduce(
          (sum, zone) => sum + Number(zone.current_capacity || 0),
          0
        ) || 0;

      const responseTimes = (resolvedResult.data || [])
        .map(row => {
          const created = new Date(row.created_at).getTime();
          const resolved = new Date(row.resolved_at).getTime();
          return Number.isFinite(created) && Number.isFinite(resolved)
            ? Math.max(0, (resolved - created) / 60000)
            : null;
        })
        .filter((value): value is number => value !== null);

      const avgResponseTime = responseTimes.length
        ? responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length
        : 0;

      if (!mounted.current) return;

      setStats(previous => ({
        totalPilgrims: pilgrimResult.count || 0,
        currentInArea,
        peakToday: Math.max(previous.peakToday, currentInArea),
        avgResponseTime,
        activeIncidents: activeResult.count || 0,
        resolvedIncidents: resolvedResult.data?.length || 0
      }));
    } catch (error) {
      console.error('Error calculating operational stats:', error);
    }
  }, [user]);

  const fetchCrowdZones = useCallback(async () => {
    const { data, error } = await supabase
      .from('crowd_zones')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching crowd zones:', error);
      return;
    }

    const zones: CrowdZone[] = (data || []).map((zone, index) => ({
      id: zone.id,
      name: zone.name,
      coordinates: toMapCoordinate(zone.coordinates, {
        x: 100 + (index % 4) * 170,
        y: 150 + Math.floor(index / 4) * 150,
      }),
      currentCapacity: Number(zone.current_capacity || 0),
      maxCapacity: Number(zone.max_capacity || 1),
      status: mapCrowdStatus(zone.status),
      lastUpdated: new Date(zone.last_updated)
    }));

    if (mounted.current) setCrowdZones(zones);
  }, []);

  const fetchEmergencyUnits = useCallback(async () => {
    const { data, error } = await supabase
      .from('emergency_units')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching emergency units:', error);
      return;
    }

    const units: EmergencyUnit[] = (data || []).map((unit, index) => ({
      id: unit.id,
      type: mapUnitType(unit.type),
      name: unit.name,
      coordinates: toMapCoordinate(unit.coordinates, {
        x: 120 + (index % 4) * 180,
        y: 120 + Math.floor(index / 4) * 160,
      }),
      status: mapUnitStatus(unit.status),
      contact: unit.contact
    }));

    if (mounted.current) setEmergencyUnits(units);
  }, []);

  const fetchRFIDDevices = useCallback(async () => {
    const { data, error } = await supabase
      .from('rfid_devices')
      .select('*')
      .order('last_seen', { ascending: false });

    if (error) {
      console.error('Error fetching RFID devices:', error);
      return;
    }

    const devices: RFIDDevice[] = (data || []).map((device, index) => ({
      id: device.id,
      wearerId: device.wearer_id,
      wearerName: device.wearer_name,
      wearerAge: Number(device.wearer_age || 0),
      guardianContact: device.guardian_contact,
      coordinates: toMapCoordinate(device.coordinates, {
        x: 130 + (index % 5) * 130,
        y: 210 + Math.floor(index / 5) * 100,
      }),
      lastSeen: new Date(device.last_seen),
      batteryLevel: Number(device.battery_level || 0),
      isDistressed: Boolean(device.is_distressed)
    }));

    if (mounted.current) setRFIDDevices(devices);
  }, []);

  const fetchAlerts = useCallback(async () => {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }

    const alertsData: Alert[] = (data || []).map((alert, index) => ({
      id: alert.id,
      type: mapAlertType(alert.type),
      severity: alert.severity,
      title: alert.title,
      description: alert.description || '',
      location: alert.location || 'Unknown',
      coordinates: toMapCoordinate(alert.coordinates, {
        x: 160 + (index % 4) * 170,
        y: 180 + Math.floor(index / 4) * 130,
      }),
      timestamp: new Date(alert.created_at),
      isActive: Boolean(alert.is_active),
      estimatedResolutionTime: alert.estimated_resolution_time ?? undefined,
      createdBy: alert.created_by,
      resolvedBy: alert.resolved_by,
      resolvedAt: alert.resolved_at ? new Date(alert.resolved_at) : null
    }));

    if (mounted.current) setAlerts(alertsData);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (profile?.role !== 'admin') {
      setUsers([]);
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id,full_name,role,department,is_active')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    if (mounted.current) {
      setUsers(
        (data || []).map(userRecord => ({
          id: userRecord.id,
          name: userRecord.full_name,
          role: userRecord.role,
          department: userRecord.department || '',
          permissions: userRecord.role === 'admin' ? ['manage_users', 'manage_alerts', 'manage_zones', 'manage_units'] : ['view_operations', 'create_alerts'],
          isOnline: true,
        }))
      );
    }
  }, [profile?.role]);

  const fetchAllData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      await Promise.all([
        fetchCrowdZones(),
        fetchEmergencyUnits(),
        fetchRFIDDevices(),
        fetchAlerts(),
        fetchUsers(),
        calculateStats()
      ]);
      if (mounted.current) setLastUpdate(new Date());
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [calculateStats, fetchAlerts, fetchCrowdZones, fetchEmergencyUnits, fetchRFIDDevices, fetchUsers, user]);

  const setupRealtimeSubscriptions = useCallback(() => {
    const channel = supabase
      .channel('simhaguard-operations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crowd_zones' }, fetchCrowdZones)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_units' }, fetchEmergencyUnits)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rfid_devices' }, fetchRFIDDevices)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, async () => {
        await fetchAlerts();
        await calculateStats();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [calculateStats, fetchAlerts, fetchCrowdZones, fetchEmergencyUnits, fetchRFIDDevices]);

  useEffect(() => {
    mounted.current = true;

    if (!user) {
      setLoading(false);
      return () => {
        mounted.current = false;
      };
    }

    void fetchAllData();
    const cleanup = setupRealtimeSubscriptions();

    return () => {
      mounted.current = false;
      cleanup();
    };
  }, [fetchAllData, setupRealtimeSubscriptions, user]);

  useEffect(() => {
    if (!user) return;
    const interval = window.setInterval(() => {
      void calculateStats();
      setLastUpdate(new Date());
    }, 30000);

    return () => window.clearInterval(interval);
  }, [calculateStats, user]);

  const addAlert = async (alertData: Omit<Alert, 'id' | 'timestamp' | 'createdBy' | 'resolvedBy' | 'resolvedAt'>) => {
    if (!user) return false;

    const { data, error } = await supabase
      .from('alerts')
      .insert({
        type: alertData.type === 'stampede' ? 'crowd' : alertData.type,
        severity: alertData.severity,
        title: alertData.title,
        description: alertData.description,
        location: alertData.location,
        coordinates: alertData.coordinates,
        is_active: alertData.isActive,
        estimated_resolution_time: alertData.estimatedResolutionTime,
        created_by: user.id
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('Error adding alert:', error);
      return false;
    }

    await supabase.from('incident_events').insert({
      alert_id: data.id,
      actor_id: user.id,
      action: 'created',
      payload: { source: 'operator_action' }
    });

    await fetchAlerts();
    await calculateStats();
    return true;
  };

  const resolveAlert = async (alertId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('alerts')
      .update({
        is_active: false,
        resolved_by: user.id,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (error) {
      console.error('Error resolving alert:', error);
      return false;
    }

    await supabase.from('incident_events').insert({
      alert_id: alertId,
      actor_id: user.id,
      action: 'resolved',
      payload: { source: 'operator_action' }
    });

    await fetchAlerts();
    await calculateStats();
    return true;
  };

  const updateCrowdZone = async (zoneId: string, updates: Partial<CrowdZone>) => {
    if (!profile?.role || profile.role !== 'admin') return false;

    const payload: Record<string, unknown> = {
      last_updated: new Date().toISOString()
    };

    if (updates.currentCapacity !== undefined) payload.current_capacity = updates.currentCapacity;
    if (updates.status !== undefined) {
      payload.status =
        updates.status === 'critical'
          ? 'critical'
          : updates.status === 'moderate'
            ? 'crowded'
            : updates.status === 'closed'
              ? 'closed'
              : 'normal';
    }

    const { error } = await supabase.from('crowd_zones').update(payload).eq('id', zoneId);
    if (error) {
      console.error('Error updating crowd zone:', error);
      return false;
    }

    await fetchCrowdZones();
    await calculateStats();
    return true;
  };

  const markRFIDDistress = async (device: RFIDDevice, distressed = true) => {
    if (!user) return false;

    const { error } = await supabase
      .from('rfid_devices')
      .update({
        is_distressed: distressed,
        last_seen: new Date().toISOString()
      })
      .eq('id', device.id);

    if (error) {
      console.error('Error updating RFID distress state:', error);
      return false;
    }

    if (distressed) {
      await addAlert({
        type: 'lost_person',
        severity: 'high',
        title: `RFID distress signal: ${device.wearerName}`,
        description: `A tracked device was marked for assistance. Verify identity and dispatch the nearest authorized responder.`,
        location: `Tracked ID ${device.wearerId}`,
        coordinates: device.coordinates,
        isActive: true
      });
    }

    await fetchRFIDDevices();
    return true;
  };

  const updateRFIDDevice = async (deviceId: string, updates: Partial<RFIDDevice>) => {
    if (!user) return false;

    const payload: Record<string, unknown> = {
      last_seen: new Date().toISOString()
    };

    if (updates.coordinates) payload.coordinates = updates.coordinates;
    if (updates.batteryLevel !== undefined) payload.battery_level = updates.batteryLevel;
    if (updates.isDistressed !== undefined) payload.is_distressed = updates.isDistressed;

    const { error } = await supabase
      .from('rfid_devices')
      .update(payload)
      .eq('id', deviceId);

    if (error) {
      console.error('Error updating RFID device:', error);
      return false;
    }

    await fetchRFIDDevices();
    return true;
  };

  return {
    crowdZones,
    emergencyUnits,
    rfidDevices,
    alerts,
    users,
    stats,
    lastUpdate,
    loading,
    addAlert,
    resolveAlert,
    updateCrowdZone,
    updateRFIDDevice,
    markRFIDDistress,
    fetchAllData
  };
};
