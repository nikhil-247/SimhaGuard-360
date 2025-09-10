/*
  # Complete SimhaGuard 360 Database Schema

  1. New Tables
    - `users` - User profiles with role-based access
    - `crowd_zones` - Monitoring areas with capacity tracking
    - `emergency_units` - Response teams and their status
    - `rfid_devices` - Pilgrim tracking devices
    - `alerts` - Emergency notifications and incidents

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for role-based access
    - Secure authentication integration

  3. Features
    - Real-time data synchronization
    - Comprehensive tracking and monitoring
    - Emergency response coordination
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone text,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crowd zones table
CREATE TABLE IF NOT EXISTS crowd_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  coordinates jsonb NOT NULL,
  current_capacity integer DEFAULT 0,
  max_capacity integer NOT NULL,
  status text DEFAULT 'normal' CHECK (status IN ('normal', 'crowded', 'critical', 'closed')),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Create emergency units table
CREATE TABLE IF NOT EXISTS emergency_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('medical', 'security', 'fire', 'rescue')),
  name text NOT NULL,
  coordinates jsonb NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  contact text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create RFID devices table
CREATE TABLE IF NOT EXISTS rfid_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wearer_id text UNIQUE NOT NULL,
  wearer_name text NOT NULL,
  wearer_age integer,
  guardian_contact text,
  coordinates jsonb,
  last_seen timestamptz DEFAULT now(),
  battery_level integer DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  is_distressed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('crowd', 'medical', 'security', 'weather', 'system')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text,
  location text,
  coordinates jsonb,
  is_active boolean DEFAULT true,
  estimated_resolution_time integer,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_by uuid REFERENCES users(id),
  resolved_by uuid REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfid_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for crowd_zones
CREATE POLICY "Authenticated users can read crowd zones"
  ON crowd_zones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage crowd zones"
  ON crowd_zones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for emergency_units
CREATE POLICY "Authenticated users can read emergency units"
  ON emergency_units
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage emergency units"
  ON emergency_units
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for rfid_devices
CREATE POLICY "Authenticated users can read RFID devices"
  ON rfid_devices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage RFID devices"
  ON rfid_devices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for alerts
CREATE POLICY "Authenticated users can read alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create alerts"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can manage all alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crowd_zones_status ON crowd_zones(status);
CREATE INDEX IF NOT EXISTS idx_emergency_units_status ON emergency_units(status);
CREATE INDEX IF NOT EXISTS idx_rfid_devices_last_seen ON rfid_devices(last_seen);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();