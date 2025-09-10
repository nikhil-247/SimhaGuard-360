import { useState, useEffect } from 'react';
import { CrowdZone, EmergencyUnit, RFIDDevice, Alert, PilgrimStats } from '../types/dashboard';
import { useSupabaseData } from './useSupabaseData';

// This hook now serves as a fallback for demo mode
export const useRealTimeData = () => {
  // Use Supabase data hook for real data
  return useSupabaseData();
};