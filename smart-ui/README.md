# STTMS — Smart Traffic & Transport Management System
### Cameroun Urban Traffic Intelligence Platform

A full-stack React.js dashboard system for managing urban traffic, public transport, IoT sensors, incidents and emergency alerts across Douala and Yaoundé.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Then open: **http://localhost:5173**

---

## 🔐 Demo Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sttms.cm | admin123 |
| Traffic Analyst | analyst@sttms.cm | analyst123 |
| Transport Operator | operator@sttms.cm | operator123 |
| Traffic Warden | warden@sttms.cm | warden123 |
| Commuter | commuter@sttms.cm | commuter123 |
| Enforcement Officer | officer@sttms.cm | officer123 |

---

## 📁 Project Structure

```
src/
├── assets/            # Static assets
├── components/        # Reusable UI components
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   └── UIComponents.jsx  # TrafficCard, Modal, SearchBar, etc.
├── context/
│   ├── AuthContext.jsx    # Auth + role-based access
│   └── ThemeContext.jsx   # Dark/light mode
├── data/
│   ├── trafficData.js     # Cameroun dummy data
│   └── users.js           # User accounts
├── layouts/
│   └── DashboardLayout.jsx
├── pages/
│   ├── auth/              # Login, Register, ForgotPassword
│   ├── dashboard/         # All 10 management pages
│   └── commuter/          # Commuter mobile-style pages
├── routes/
│   └── ProtectedRoute.jsx
├── styles/
│   └── globals.css        # Tailwind + custom components
├── App.jsx
└── main.jsx
```

---

## 🗺️ Pages

| Page | Route | Access |
|------|-------|--------|
| Dashboard | /dashboard | All |
| Live Traffic Map | /live-traffic | All |
| Incident Management | /incidents | All |
| Public Transport | /transport | All |
| Analytics & Reports | /analytics | All |
| Traffic Light Control | /traffic-lights | Staff |
| Vehicle Registry | /vehicles | All |
| Emergency Alerts | /alerts | All |
| IoT Sensors | /sensors | Staff |
| User Management | /users | Admin |
| Settings | /settings | All |
| Commuter Home | /commuter | All |
| Report Incident | /commuter/report | All |
| My Alerts | /commuter/alerts | All |

---

## 🛠️ Tech Stack

- **React 18** + Vite
- **Tailwind CSS** — glassmorphism dark UI
- **React Router DOM v6** — protected routes
- **Recharts** — traffic analytics charts
- **React Leaflet** — live traffic map
- **Framer Motion** — animations
- **React Icons** — Material Design icons
- **Context API** — auth & theme state

---

## 🌍 Cameroun Data

Dummy data includes realistic:
- Douala roads: Autoroute DLA-YDE, Carrefour Ndokotti, Boulevard Liberté, etc.
- Yaoundé roads: Boulevard du 20 Mai, Carrefour Mvog-Mbi, etc.
- Bus routes: Bonaberi → Ndokotti, Yaoundé Centre circular, etc.
- GPS coordinates for Leaflet map markers
- Traffic density, speed, congestion levels
- IoT sensor readings (cameras, loop detectors, air quality, weather)

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```
