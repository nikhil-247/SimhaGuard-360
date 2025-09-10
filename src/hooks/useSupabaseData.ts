import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CrowdZone, EmergencyUnit, RFIDDevice, Alert, PilgrimStats } from '../types/dashboard';
import { useAuth } from '../contexts/AuthContext';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [crowdZones, setCrowdZones] = useState<CrowdZone[]>([]);
  const [emergencyUnits, setEmergencyUnits] = useState<EmergencyUnit[]>([]);
  const [rfidDevices, setRFIDDevices] = useState<RFIDDevice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
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

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchAllData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCrowdZones(),
        fetchEmergencyUnits(),
        fetchRFIDDevices(),
        fetchAlerts(),
        calculateStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrowdZones = async () => {
    const { data, error } = await supabase
      .from('crowd_zones')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching crowd zones:', error);
      return;
    }

    const zones: CrowdZone[] = data.map(zone => ({
      id: zone.id,
      name: zone.name,
      coordinates: zone.coordinates,
      currentCapacity: zone.current_capacity,
      maxCapacity: zone.max_capacity,
      status: zone.status,
      lastUpdated: new Date(zone.last_updated)
    }));

    setCrowdZones(zones);
  };

  const fetchEmergencyUnits = async () => {
    const { data, error } = await supabase
      .from('emergency_units')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching emergency units:', error);
      return;
    }

    const units: EmergencyUnit[] = data.map(unit => ({
      id: unit.id,
      type: unit.type,
      name: unit.name,
      coordinates: unit.coordinates,
      status: unit.status,
      contact: unit.contact
    }));

    setEmergencyUnits(units);
  };

  const fetchRFIDDevices = async () => {
    const { data, error } = await supabase
      .from('rfid_devices')
      .select('*')
      .order('last_seen', { ascending: false });

    if (error) {
      console.error('Error fetching RFID devices:', error);
      return;
    }

    const devices: RFIDDevice[] = data.map(device => ({
      id: device.id,
      wearerId: device.wearer_id,
      wearerName: device.wearer_name,
      wearerAge: device.wearer_age,
      guardianContact: device.guardian_contact,
      coordinates: device.coordinates,
      lastSeen: new Date(device.last_seen),
      batteryLevel: device.battery_level,
      isDistressed: device.is_distressed
    }));

    setRFIDDevices(devices);
  };

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }

    const alertsData: Alert[] = data.map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      location: alert.location,
      coordinates: alert.coordinates,
      timestamp: new Date(alert.created_at),
      isActive: alert.is_active,
      estimatedResolutionTime: alert.estimated_resolution_time
    }));

    setAlerts(alertsData);
  };

  const calculateStats = async () => {
    try {
      // Get total pilgrims (sum of all RFID devices)
      const { count: totalPilgrims } = await supabase
        .from('rfid_devices')
        .select('*', { count: 'exact', head: true });

      // Get current in area (sum of current capacities)
      const { data: zones } = await supabase
        .from('crowd_zones')
        .select('current_capacity');

      const currentInArea = zones?.reduce((sum, zone) => sum + zone.current_capacity, 0) || 0;

      // Get active incidents
      const { count: activeIncidents } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get resolved incidents today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: resolvedIncidents } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false)
        .gte('resolved_at', today.toISOString());

      setStats({
        totalPilgrims: totalPilgrims || 0,
        currentInArea,
        peakToday: Math.max(currentInArea, stats.peakToday),
        avgResponseTime: 4.2,
        activeIncidents: activeIncidents || 0,
        resolvedIncidents: resolvedIncidents || 0
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to crowd zones changes
    const crowdZonesSubscription = supabase
      .channel('crowd_zones_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'crowd_zones' },
        () => fetchCrowdZones()
      )
      .subscribe();

    // Subscribe to alerts changes
    const alertsSubscription = supabase
      .channel('alerts_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => fetchAlerts()
      )
      .subscribe();

    // Subscribe to RFID devices changes
    const rfidSubscription = supabase
      .channel('rfid_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'rfid_devices' },
        () => fetchRFIDDevices()
      )
      .subscribe();

    return () => {
      crowdZonesSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
      rfidSubscription.unsubscribe();
    };
  };

  const addAlert = async (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('alerts')
      .insert({
        type: alertData.type,
        severity: alertData.severity,
        title: alertData.title,
        description: alertData.description,
        location: alertData.location,
        coordinates: alertData.coordinates,
        is_active: alertData.isActive,
        estimated_resolution_time: alertData.estimatedResolutionTime,
        created_by: user.id
      });

    if (error) {
      console.error('Error adding alert:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    if (!user) return;

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
    }
  };

  const updateCrowdZone = async (zoneId: string, updates: Partial<CrowdZone>) => {
    const { error } = await supabase
      .from('crowd_zones')
      .update({
        current_capacity: updates.currentCapacity,
        status: updates.status,
        last_updated: new Date().toISOString()
      })
      .eq('id', zoneId);

    if (error) {
      console.error('Error updating crowd zone:', error);
    }
  };

  const updateRFIDDevice = async (deviceId: string, updates: Partial<RFIDDevice>) => {
    const { error } = await supabase
      .from('rfid_devices')
      .update({
        coordinates: updates.coordinates,
        battery_level: updates.batteryLevel,
        is_distressed: updates.isDistressed,
        last_seen: new Date().toISOString()
      })
      .eq('id', deviceId);

    if (error) {
      console.error('Error updating RFID device:', error);
    }
  };

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      calculateStats();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    crowdZones,
    emergencyUnits,
    rfidDevices,
    alerts,
    stats,
    lastUpdate,
    loading,
    addAlert,
    resolveAlert,
    updateCrowdZone,
    updateRFIDDevice,
    fetchAllData
  };
};