import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'user';
          full_name: string;
          department: string;
          phone: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'admin' | 'user';
          full_name: string;
          department: string;
          phone: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'user';
          full_name?: string;
          department?: string;
          phone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      crowd_zones: {
        Row: {
          id: string;
          name: string;
          coordinates: any;
          current_capacity: number;
          max_capacity: number;
          status: 'safe' | 'moderate' | 'critical';
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          coordinates: any;
          current_capacity: number;
          max_capacity: number;
          status?: 'safe' | 'moderate' | 'critical';
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          coordinates?: any;
          current_capacity?: number;
          max_capacity?: number;
          status?: 'safe' | 'moderate' | 'critical';
          last_updated?: string;
          created_at?: string;
        };
      };
      emergency_units: {
        Row: {
          id: string;
          type: 'medical' | 'police' | 'rescue' | 'fire';
          name: string;
          coordinates: any;
          status: 'available' | 'busy' | 'emergency';
          contact: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'medical' | 'police' | 'rescue' | 'fire';
          name: string;
          coordinates: any;
          status?: 'available' | 'busy' | 'emergency';
          contact: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'medical' | 'police' | 'rescue' | 'fire';
          name?: string;
          coordinates?: any;
          status?: 'available' | 'busy' | 'emergency';
          contact?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      rfid_devices: {
        Row: {
          id: string;
          wearer_id: string;
          wearer_name: string;
          wearer_age: number;
          guardian_contact: string | null;
          coordinates: any;
          last_seen: string;
          battery_level: number;
          is_distressed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wearer_id: string;
          wearer_name: string;
          wearer_age: number;
          guardian_contact?: string | null;
          coordinates: any;
          last_seen?: string;
          battery_level?: number;
          is_distressed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wearer_id?: string;
          wearer_name?: string;
          wearer_age?: number;
          guardian_contact?: string | null;
          coordinates?: any;
          last_seen?: string;
          battery_level?: number;
          is_distressed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          type: 'stampede' | 'fire' | 'flood' | 'medical' | 'lost_person' | 'security';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          location: string;
          coordinates: any;
          is_active: boolean;
          estimated_resolution_time: string | null;
          created_by: string;
          resolved_by: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          type: 'stampede' | 'fire' | 'flood' | 'medical' | 'lost_person' | 'security';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          location: string;
          coordinates: any;
          is_active?: boolean;
          estimated_resolution_time?: string | null;
          created_by: string;
          resolved_by?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          type?: 'stampede' | 'fire' | 'flood' | 'medical' | 'lost_person' | 'security';
          severity?: 'low' | 'medium' | 'high' | 'critical';
          title?: string;
          description?: string;
          location?: string;
          coordinates?: any;
          is_active?: boolean;
          estimated_resolution_time?: string | null;
          created_by?: string;
          resolved_by?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
    };
  };
}