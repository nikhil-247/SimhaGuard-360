/*
  # Insert Demo Data for SimhaGuard 360

  1. Demo Users
    - Admin user with full access
    - Regular user for testing

  2. Sample Data
    - Crowd monitoring zones
    - Emergency response units
    - RFID tracking devices
    - Sample alerts and incidents

  3. Realistic Data
    - Based on Kumbh Mela requirements
    - Proper geographical coordinates
    - Varied status and capacity data
*/

-- Insert demo crowd zones
INSERT INTO crowd_zones (name, coordinates, current_capacity, max_capacity, status) VALUES
('Main Ghat Area', '{"lat": 25.4358, "lng": 81.8463}', 15000, 20000, 'crowded'),
('Parking Zone A', '{"lat": 25.4320, "lng": 81.8420}', 5000, 8000, 'normal'),
('Food Court Area', '{"lat": 25.4380, "lng": 81.8500}', 3000, 5000, 'normal'),
('Medical Camp Zone', '{"lat": 25.4340, "lng": 81.8440}', 500, 1000, 'normal'),
('VIP Enclosure', '{"lat": 25.4370, "lng": 81.8480}', 200, 500, 'normal'),
('Bathing Ghat 1', '{"lat": 25.4350, "lng": 81.8470}', 8000, 12000, 'crowded'),
('Bathing Ghat 2', '{"lat": 25.4360, "lng": 81.8475}', 6000, 10000, 'normal'),
('Emergency Assembly Point', '{"lat": 25.4330, "lng": 81.8430}', 0, 2000, 'normal')
ON CONFLICT DO NOTHING;

-- Insert emergency units
INSERT INTO emergency_units (type, name, coordinates, status, contact) VALUES
('medical', 'Medical Team Alpha', '{"lat": 25.4340, "lng": 81.8440}', 'available', '+91-9876543210'),
('medical', 'Medical Team Beta', '{"lat": 25.4365, "lng": 81.8485}', 'busy', '+91-9876543211'),
('security', 'Security Unit 1', '{"lat": 25.4355, "lng": 81.8465}', 'available', '+91-9876543212'),
('security', 'Security Unit 2', '{"lat": 25.4375, "lng": 81.8495}', 'available', '+91-9876543213'),
('fire', 'Fire Safety Team', '{"lat": 25.4325, "lng": 81.8425}', 'available', '+91-9876543214'),
('rescue', 'Water Rescue Team', '{"lat": 25.4345, "lng": 81.8455}', 'available', '+91-9876543215'),
('medical', 'Ambulance Unit 1', '{"lat": 25.4335, "lng": 81.8445}', 'busy', '+91-9876543216'),
('security', 'Crowd Control Unit', '{"lat": 25.4385, "lng": 81.8505}', 'available', '+91-9876543217')
ON CONFLICT DO NOTHING;

-- Insert RFID devices (pilgrim tracking)
INSERT INTO rfid_devices (wearer_id, wearer_name, wearer_age, guardian_contact, coordinates, battery_level, is_distressed) VALUES
('RFID001', 'Rajesh Kumar', 45, '+91-9876543220', '{"lat": 25.4358, "lng": 81.8463}', 85, false),
('RFID002', 'Priya Sharma', 32, '+91-9876543221', '{"lat": 25.4360, "lng": 81.8465}', 92, false),
('RFID003', 'Amit Patel', 28, '+91-9876543222', '{"lat": 25.4355, "lng": 81.8460}', 78, false),
('RFID004', 'Sunita Devi', 55, '+91-9876543223', '{"lat": 25.4365, "lng": 81.8470}', 65, true),
('RFID005', 'Ravi Singh', 38, '+91-9876543224', '{"lat": 25.4350, "lng": 81.8455}', 88, false),
('RFID006', 'Meera Gupta', 42, '+91-9876543225', '{"lat": 25.4370, "lng": 81.8475}', 95, false),
('RFID007', 'Vikash Yadav', 29, '+91-9876543226', '{"lat": 25.4345, "lng": 81.8450}', 72, false),
('RFID008', 'Anita Mishra', 36, '+91-9876543227', '{"lat": 25.4375, "lng": 81.8480}', 81, false),
('RFID009', 'Deepak Joshi', 50, '+91-9876543228', '{"lat": 25.4340, "lng": 81.8445}', 90, false),
('RFID010', 'Kavita Singh', 33, '+91-9876543229', '{"lat": 25.4380, "lng": 81.8485}', 76, false)
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (type, severity, title, description, location, coordinates, is_active, estimated_resolution_time) VALUES
('crowd', 'high', 'High Crowd Density Alert', 'Main Ghat area approaching maximum capacity', 'Main Ghat Area', '{"lat": 25.4358, "lng": 81.8463}', true, 30),
('medical', 'critical', 'Medical Emergency', 'Elderly pilgrim requires immediate assistance', 'Bathing Ghat 1', '{"lat": 25.4350, "lng": 81.8470}', true, 15),
('security', 'medium', 'Lost Child Alert', 'Child separated from family group', 'Food Court Area', '{"lat": 25.4380, "lng": 81.8500}', true, 45),
('weather', 'low', 'Weather Advisory', 'Light rain expected in next 2 hours', 'All Areas', '{"lat": 25.4358, "lng": 81.8463}', true, 120),
('system', 'medium', 'RFID Device Low Battery', 'Multiple devices showing low battery levels', 'Various Locations', '{"lat": 25.4358, "lng": 81.8463}', true, 60),
('crowd', 'medium', 'Crowd Flow Disruption', 'Bottleneck detected at main entrance', 'Main Entrance', '{"lat": 25.4330, "lng": 81.8430}', false, null),
('medical', 'low', 'First Aid Request', 'Minor injury treated successfully', 'Medical Camp Zone', '{"lat": 25.4340, "lng": 81.8440}', false, null)
ON CONFLICT DO NOTHING;

-- Update statistics for realistic data
UPDATE crowd_zones SET last_updated = now() - interval '5 minutes' WHERE name = 'Main Ghat Area';
UPDATE crowd_zones SET last_updated = now() - interval '10 minutes' WHERE name = 'Parking Zone A';
UPDATE rfid_devices SET last_seen = now() - interval '2 minutes' WHERE wearer_id IN ('RFID001', 'RFID002');
UPDATE rfid_devices SET last_seen = now() - interval '5 minutes' WHERE wearer_id IN ('RFID003', 'RFID004');