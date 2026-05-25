import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

import LoginPage          from './pages/auth/LoginPage'
import RegisterPage       from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

import DashboardPage      from './pages/dashboard/DashboardPage'
import LiveTrafficPage    from './pages/dashboard/LiveTrafficPage'
import IncidentsPage      from './pages/dashboard/IncidentsPage'
import TransportPage      from './pages/dashboard/TransportPage'
import AnalyticsPage      from './pages/dashboard/AnalyticsPage'
import TrafficLightsPage  from './pages/dashboard/TrafficLightsPage'
import VehiclesPage       from './pages/dashboard/VehiclesPage'
import AlertsPage         from './pages/dashboard/AlertsPage'
import SensorsPage        from './pages/dashboard/SensorsPage'
import UsersPage          from './pages/dashboard/UsersPage'
import SettingsPage       from './pages/dashboard/SettingsPage'
import AIAssistantPage    from './pages/dashboard/AIAssistantPage'

import CommuterHomePage   from './pages/commuter/CommuterHomePage'
import CommuterReportPage from './pages/commuter/CommuterReportPage'
import CommuterAlertsPage from './pages/commuter/CommuterAlertsPage'

const ALL    = ['Admin','Traffic Analyst','Transport Operator','Traffic Warden','Commuter','Enforcement Officer']
const STAFF  = ['Admin','Traffic Analyst','Transport Operator','Traffic Warden','Enforcement Officer']
const ADMIN  = ['Admin']

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/"                element={<Navigate to="/dashboard" replace />} />

          <Route path="/" element={
            <ProtectedRoute allowedRoles={ALL}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard"      element={<DashboardPage />} />
            <Route path="live-traffic"   element={<LiveTrafficPage />} />
            <Route path="incidents"      element={<IncidentsPage />} />
            <Route path="transport"      element={<TransportPage />} />
            <Route path="analytics"      element={<AnalyticsPage />} />
            <Route path="vehicles"       element={<VehiclesPage />} />
            <Route path="alerts"         element={<AlertsPage />} />
            <Route path="ai"             element={<AIAssistantPage />} />
            <Route path="settings"       element={<SettingsPage />} />
            <Route path="commuter"       element={<CommuterHomePage />} />
            <Route path="commuter/report" element={<CommuterReportPage />} />
            <Route path="commuter/alerts" element={<CommuterAlertsPage />} />
            <Route path="traffic-lights" element={
              <ProtectedRoute allowedRoles={STAFF}><TrafficLightsPage /></ProtectedRoute>
            } />
            <Route path="sensors" element={
              <ProtectedRoute allowedRoles={STAFF}><SensorsPage /></ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={ADMIN}><UsersPage /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
}
