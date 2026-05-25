// ─── Douala Road Segments ─────────────────────────────────────────────────────
export const roads = [
  { id: 'R001', name: 'Autoroute Douala–Yaoundé', city: 'Douala', length: 42, congestion: 'high',   density: 87, speed: 28, lat: 4.0511, lng: 9.7679 },
  { id: 'R002', name: 'Boulevard de la Liberté',  city: 'Douala', length: 8,  congestion: 'medium', density: 62, speed: 45, lat: 4.0560, lng: 9.7060 },
  { id: 'R003', name: 'Rue de la Joie',           city: 'Douala', length: 3,  congestion: 'low',    density: 30, speed: 65, lat: 4.0439, lng: 9.6959 },
  { id: 'R004', name: 'Avenue Charles de Gaulle', city: 'Douala', length: 6,  congestion: 'high',   density: 91, speed: 18, lat: 4.0581, lng: 9.7233 },
  { id: 'R005', name: 'Carrefour Ndokotti',       city: 'Douala', length: 2,  congestion: 'critical',density:98, speed: 5,  lat: 4.0488, lng: 9.7315 },
  { id: 'R006', name: 'Rue Njo-Njo',              city: 'Douala', length: 4,  congestion: 'medium', density: 55, speed: 50, lat: 4.0350, lng: 9.7120 },
  { id: 'R007', name: 'Avenue Ahmadou Ahidjo',    city: 'Yaoundé',length: 7,  congestion: 'low',    density: 25, speed: 70, lat: 3.8667, lng: 11.5167 },
  { id: 'R008', name: 'Carrefour Mvog-Mbi',       city: 'Yaoundé',length: 3,  congestion: 'high',   density: 80, speed: 22, lat: 3.8480, lng: 11.5080 },
  { id: 'R009', name: 'Boulevard du 20 Mai',      city: 'Yaoundé',length: 9,  congestion: 'medium', density: 58, speed: 48, lat: 3.8700, lng: 11.5250 },
  { id: 'R010', name: 'Carrefour Obili',          city: 'Yaoundé',length: 2,  congestion: 'medium', density: 60, speed: 42, lat: 3.8550, lng: 11.4950 },
]

export const congestionColor = {
  'low':      '#22c55e',
  'medium':   '#f59e0b',
  'high':     '#f97316',
  'critical': '#ef4444',
}

// ─── Traffic Statistics (for charts) ──────────────────────────────────────────
export const hourlyTraffic = [
  { time: '06:00', vehicles: 1200, avgSpeed: 58, incidents: 0 },
  { time: '07:00', vehicles: 3400, avgSpeed: 35, incidents: 2 },
  { time: '08:00', vehicles: 5800, avgSpeed: 20, incidents: 5 },
  { time: '09:00', vehicles: 4600, avgSpeed: 30, incidents: 3 },
  { time: '10:00', vehicles: 3200, avgSpeed: 45, incidents: 1 },
  { time: '11:00', vehicles: 2800, avgSpeed: 52, incidents: 1 },
  { time: '12:00', vehicles: 3600, avgSpeed: 38, incidents: 2 },
  { time: '13:00', vehicles: 3900, avgSpeed: 35, incidents: 3 },
  { time: '14:00', vehicles: 3100, avgSpeed: 48, incidents: 1 },
  { time: '15:00', vehicles: 2900, avgSpeed: 50, incidents: 0 },
  { time: '16:00', vehicles: 4200, avgSpeed: 28, incidents: 4 },
  { time: '17:00', vehicles: 6100, avgSpeed: 15, incidents: 7 },
  { time: '18:00', vehicles: 5500, avgSpeed: 18, incidents: 6 },
  { time: '19:00', vehicles: 3800, avgSpeed: 35, incidents: 2 },
  { time: '20:00', vehicles: 2400, avgSpeed: 55, incidents: 1 },
  { time: '21:00', vehicles: 1600, avgSpeed: 62, incidents: 0 },
  { time: '22:00', vehicles: 1100, avgSpeed: 68, incidents: 0 },
  { time: '23:00', vehicles: 700,  avgSpeed: 72, incidents: 0 },
]

export const weeklyData = [
  { day: 'Mon', douala: 42000, yaounde: 31000 },
  { day: 'Tue', douala: 38000, yaounde: 28000 },
  { day: 'Wed', douala: 45000, yaounde: 33000 },
  { day: 'Thu', douala: 41000, yaounde: 30000 },
  { day: 'Fri', douala: 52000, yaounde: 39000 },
  { day: 'Sat', douala: 35000, yaounde: 26000 },
  { day: 'Sun', douala: 28000, yaounde: 20000 },
]

export const monthlyData = [
  { month: 'Jan', incidents: 142, vehicles: 890000, avgSpeed: 42 },
  { month: 'Feb', incidents: 118, vehicles: 820000, avgSpeed: 45 },
  { month: 'Mar', incidents: 165, vehicles: 950000, avgSpeed: 38 },
  { month: 'Apr', incidents: 198, vehicles: 1020000, avgSpeed: 35 },
  { month: 'May', incidents: 187, vehicles: 980000, avgSpeed: 37 },
  { month: 'Jun', incidents: 210, vehicles: 1100000, avgSpeed: 33 },
]

// ─── Incidents ─────────────────────────────────────────────────────────────────
export const incidents = [
  { id: 'INC-001', type: 'Accident',       road: 'Autoroute Douala–Yaoundé', city: 'Douala',  severity: 'critical', status: 'Active',   time: '08:32', date: '2025-06-12', lat: 4.0511, lng: 9.7679, description: 'Multi-vehicle collision near PK14 toll gate. 2 vehicles involved. Emergency services dispatched.', reportedBy: 'Sensor CAM-04' },
  { id: 'INC-002', type: 'Road Work',      road: 'Boulevard de la Liberté',  city: 'Douala',  severity: 'medium',   status: 'Active',   time: '07:15', date: '2025-06-12', lat: 4.0560, lng: 9.7060, description: 'Scheduled maintenance blocking lane 2. Expected completion 14:00.', reportedBy: 'Operator Ekane S.' },
  { id: 'INC-003', type: 'Breakdown',      road: 'Avenue Charles de Gaulle', city: 'Douala',  severity: 'low',      status: 'Resolved', time: '09:05', date: '2025-06-12', lat: 4.0581, lng: 9.7233, description: 'Single bus breakdown. Tow truck dispatched. Lane partially clear.', reportedBy: 'Traffic Warden Fopa J.' },
  { id: 'INC-004', type: 'Flood',          road: 'Carrefour Ndokotti',       city: 'Douala',  severity: 'high',     status: 'Active',   time: '06:50', date: '2025-06-12', lat: 4.0488, lng: 9.7315, description: 'Heavy rain caused flooding. Road impassable. Diversion in place.', reportedBy: 'IoT Sensor S-012' },
  { id: 'INC-005', type: 'Protest',        road: 'Carrefour Mvog-Mbi',       city: 'Yaoundé', severity: 'high',     status: 'Monitoring', time: '10:20', date: '2025-06-12', lat: 3.8480, lng: 11.5080, description: 'Public gathering blocking main intersection. Police presence required.', reportedBy: 'Warden Manga P.' },
  { id: 'INC-006', type: 'Signal Fault',   road: 'Boulevard du 20 Mai',      city: 'Yaoundé', severity: 'medium',   status: 'Active',   time: '11:45', date: '2025-06-12', lat: 3.8700, lng: 11.5250, description: 'Traffic light malfunction at junction with Rue 1.811. Manual control engaged.', reportedBy: 'Auto-detect' },
  { id: 'INC-007', type: 'Accident',       road: 'Rue Njo-Njo',              city: 'Douala',  severity: 'low',      status: 'Resolved', time: '14:10', date: '2025-06-11', lat: 4.0350, lng: 9.7120, description: 'Minor fender-bender. No injuries. Vehicles moved to roadside.', reportedBy: 'Citizen Report' },
  { id: 'INC-008', type: 'Breakdown',      road: 'Avenue Ahmadou Ahidjo',    city: 'Yaoundé', severity: 'low',      status: 'Resolved', time: '15:30', date: '2025-06-11', lat: 3.8667, lng: 11.5167, description: 'Cargo truck engine failure. Cleared within 30 mins.', reportedBy: 'Traffic Warden' },
]

// ─── Traffic Lights ────────────────────────────────────────────────────────────
export const trafficLights = [
  { id: 'TL-001', location: 'Carrefour Ndokotti',    city: 'Douala',  status: 'auto',     phase: 'red',    cycleTime: 90,  mode: 'adaptive', lat: 4.0488, lng: 9.7315 },
  { id: 'TL-002', location: 'Carrefour de la Poste', city: 'Douala',  status: 'manual',   phase: 'green',  cycleTime: 60,  mode: 'manual',   lat: 4.0530, lng: 9.7010 },
  { id: 'TL-003', location: 'Rond-Point Deido',      city: 'Douala',  status: 'auto',     phase: 'yellow', cycleTime: 75,  mode: 'adaptive', lat: 4.0620, lng: 9.6880 },
  { id: 'TL-004', location: 'Carrefour Mvog-Mbi',    city: 'Yaoundé', status: 'fault',    phase: 'off',    cycleTime: 0,   mode: 'fault',    lat: 3.8480, lng: 11.5080 },
  { id: 'TL-005', location: 'Carrefour Obili',       city: 'Yaoundé', status: 'auto',     phase: 'green',  cycleTime: 80,  mode: 'adaptive', lat: 3.8550, lng: 11.4950 },
  { id: 'TL-006', location: 'Carrefour Nlongkak',    city: 'Yaoundé', status: 'emergency',phase: 'flash',  cycleTime: 30,  mode: 'emergency',lat: 3.8740, lng: 11.5120 },
]

// ─── IoT Sensors ───────────────────────────────────────────────────────────────
export const sensors = [
  { id: 'S-001', type: 'Camera',       location: 'Autoroute DLA-YDE PK14', city: 'Douala',  status: 'online',  battery: 100, lastPing: '1m ago', data: { vehicles: 312, speed: 28 }, lat: 4.0511, lng: 9.7679 },
  { id: 'S-002', type: 'Loop Detector',location: 'Boulevard Liberté',      city: 'Douala',  status: 'online',  battery: 85,  lastPing: '2m ago', data: { vehicles: 188, speed: 45 }, lat: 4.0560, lng: 9.7060 },
  { id: 'S-003', type: 'Air Quality',  location: 'Akwa Business District',  city: 'Douala',  status: 'online',  battery: 72,  lastPing: '1m ago', data: { pm25: 45, co2: 412 },       lat: 4.0440, lng: 9.6960 },
  { id: 'S-004', type: 'Weather',      location: 'Port de Douala',          city: 'Douala',  status: 'offline', battery: 12,  lastPing: '2h ago', data: { temp: 30, humidity: 88 },    lat: 4.0430, lng: 9.7020 },
  { id: 'S-005', type: 'Camera',       location: 'Carrefour Ndokotti',      city: 'Douala',  status: 'online',  battery: 95,  lastPing: '30s ago',data: { vehicles: 421, speed: 8 },  lat: 4.0488, lng: 9.7315 },
  { id: 'S-006', type: 'Loop Detector',location: 'Carrefour Mvog-Mbi',     city: 'Yaoundé', status: 'fault',   battery: 60,  lastPing: '15m ago',data: { vehicles: 0, speed: 0 },     lat: 3.8480, lng: 11.5080 },
  { id: 'S-007', type: 'Camera',       location: 'Boulevard du 20 Mai',     city: 'Yaoundé', status: 'online',  battery: 88,  lastPing: '1m ago', data: { vehicles: 265, speed: 48 }, lat: 3.8700, lng: 11.5250 },
  { id: 'S-008', type: 'Air Quality',  location: 'Bastos Quartier',         city: 'Yaoundé', status: 'online',  battery: 91,  lastPing: '2m ago', data: { pm25: 22, co2: 388 },       lat: 3.8800, lng: 11.5200 },
]

// ─── Bus Routes ────────────────────────────────────────────────────────────────
export const busRoutes = [
  { id: 'BR-01', name: 'Douala Express',   from: 'Bonaberi',       to: 'Ndokotti',      stops: 12, buses: 8,  active: 6, city: 'Douala',  frequency: '15 min', status: 'operational' },
  { id: 'BR-02', name: 'Akwa Circular',    from: 'Carrefour Poste',to: 'Deido',         stops: 8,  buses: 5,  active: 4, city: 'Douala',  frequency: '20 min', status: 'operational' },
  { id: 'BR-03', name: 'Bassa Link',       from: 'Douala Centre',  to: 'Bassa Industrial', stops: 15, buses: 6, active: 5, city: 'Douala', frequency: '25 min', status: 'delayed' },
  { id: 'BR-04', name: 'Yaoundé Centre',   from: 'Nlongkak',       to: 'Mvog-Mbi',      stops: 10, buses: 7,  active: 6, city: 'Yaoundé', frequency: '15 min', status: 'operational' },
  { id: 'BR-05', name: 'Bastos Shuttle',   from: 'Mvog-Ada',       to: 'Bastos',        stops: 6,  buses: 4,  active: 3, city: 'Yaoundé', frequency: '30 min', status: 'operational' },
  { id: 'BR-06', name: 'Mvan Airport Link',from: 'Centre Ville',   to: 'Aéroport Nsimalen', stops: 7, buses: 3, active: 2, city: 'Yaoundé', frequency: '45 min', status: 'disrupted' },
]

// ─── Vehicles ──────────────────────────────────────────────────────────────────
export const vehicles = [
  { id: 'V-001', plate: 'CE 1234 A', type: 'Taxi', make: 'Toyota', model: 'Corolla', year: 2019, owner: 'Nkuete Bernard', license: 'DLA-TXI-22931', status: 'active',   city: 'Douala',  color: 'Yellow' },
  { id: 'V-002', plate: 'LT 5678 B', type: 'Bus',  make: 'Mercedes', model: 'Sprinter', year: 2020, owner: 'Cameroun Express SARL', license: 'DLA-BUS-11042', status: 'active', city: 'Douala', color: 'White' },
  { id: 'V-003', plate: 'SW 9012 C', type: 'Truck',make: 'Man TGX', model: 'TGX 18.440', year: 2021, owner: 'Transport Fovi SA', license: 'DLA-TRK-33210', status: 'active', city: 'Douala', color: 'Blue' },
  { id: 'V-004', plate: 'CE 3456 D', type: 'Moto', make: 'Yamaha', model: 'FZ-S', year: 2022, owner: 'Fouda Clément', license: 'YDE-MTO-20884', status: 'suspended', city: 'Yaoundé', color: 'Red' },
  { id: 'V-005', plate: 'LT 7890 E', type: 'Taxi', make: 'Nissan', model: 'Sunny', year: 2018, owner: 'Essam Pierre', license: 'YDE-TXI-15560', status: 'active',  city: 'Yaoundé', color: 'Yellow' },
  { id: 'V-006', plate: 'AD 1357 F', type: 'Bus',  make: 'Yutong', model: 'ZK6128H', year: 2023, owner: 'SOTUC Cameroun', license: 'YDE-BUS-50012', status: 'active', city: 'Yaoundé', color: 'Orange' },
  { id: 'V-007', plate: 'CE 2468 G', type: 'Car',  make: 'Peugeot', model: '508', year: 2022, owner: 'Ministère des Transports', license: 'DLA-GOV-00123', status: 'active', city: 'Douala', color: 'Black' },
  { id: 'V-008', plate: 'SW 1122 H', type: 'Truck',make: 'Iveco',   model: 'Stralis', year: 2020, owner: 'Bolloré Africa Logistics', license: 'DLA-TRK-44890', status: 'impounded', city: 'Douala', color: 'White' },
]

// ─── Emergency Alerts ──────────────────────────────────────────────────────────
export const alerts = [
  { id: 'ALT-001', type: 'Accident Alert',   message: 'Major accident on Autoroute Douala–Yaoundé at PK14. All emergency units mobilized.', severity: 'critical', time: '08:34', date: '2025-06-12', city: 'Douala',  status: 'active', recipients: 1240 },
  { id: 'ALT-002', type: 'Flood Warning',    message: 'Flooding reported at Carrefour Ndokotti. Avoid the area. Use Boulevard Wouri as alternative.', severity: 'high', time: '06:55', date: '2025-06-12', city: 'Douala', status: 'active', recipients: 3510 },
  { id: 'ALT-003', type: 'Road Closure',     message: 'Boulevard de la Liberté partially closed due to maintenance works until 14:00.', severity: 'medium', time: '07:00', date: '2025-06-12', city: 'Douala',  status: 'active', recipients: 890 },
  { id: 'ALT-004', type: 'Signal Fault',     message: 'Traffic light fault at Carrefour Mvog-Mbi. Manual control in place. Expect delays.', severity: 'medium', time: '11:48', date: '2025-06-12', city: 'Yaoundé', status: 'active', recipients: 620 },
  { id: 'ALT-005', type: 'Security Alert',   message: 'Public gathering blocking Carrefour Mvog-Mbi. Security forces deployed.', severity: 'high', time: '10:22', date: '2025-06-12', city: 'Yaoundé', status: 'monitoring', recipients: 1500 },
  { id: 'ALT-006', type: 'Storm Warning',    message: 'Heavy rain expected 15:00–18:00. Reduced visibility. Drive with caution.', severity: 'medium', time: '09:00', date: '2025-06-12', city: 'All Cities', status: 'broadcast', recipients: 12400 },
]

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notifications = [
  { id: 1, title: 'Critical Accident',      body: 'Major accident on Autoroute DLA-YDE PK14', time: '2m ago',  read: false, type: 'critical' },
  { id: 2, title: 'Sensor Offline',         body: 'Sensor S-004 at Port de Douala is offline', time: '18m ago', read: false, type: 'warning' },
  { id: 3, title: 'Traffic Light Fault',    body: 'TL-004 at Carrefour Mvog-Mbi malfunction', time: '32m ago', read: false, type: 'warning' },
  { id: 4, title: 'New Incident Reported',  body: 'Flooding at Carrefour Ndokotti confirmed', time: '1h ago',  read: true,  type: 'info' },
  { id: 5, title: 'Report Generated',       body: 'Weekly analytics report is ready', time: '2h ago',  read: true,  type: 'info' },
  { id: 6, title: 'Bus Route Disrupted',    body: 'Route BR-06 Mvan Airport Link disrupted', time: '3h ago',  read: true,  type: 'warning' },
]
