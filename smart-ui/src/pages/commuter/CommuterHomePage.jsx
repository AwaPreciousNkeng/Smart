import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MdDirectionsBus, MdWarning, MdNotificationsActive, MdNavigation,
  MdSpeed, MdTraffic, MdAddAlert
} from 'react-icons/md'
import { roads, alerts, busRoutes } from '../../data/trafficData'
import { SeverityBadge, StatusBadge } from '../../components/UIComponents'

const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'broadcast').slice(0, 3)
const nearbyRoutes = busRoutes.slice(0, 3)
const congested = roads.filter(r => r.congestion === 'high' || r.congestion === 'critical')

export default function CommuterHomePage() {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="page-title">Commuter Dashboard</h1>
        <p className="text-surface-300 text-sm mt-1">Your traffic updates, routes and alerts</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Traffic Updates', icon: MdTraffic, path: '/live-traffic', color: 'bg-primary-600/20 border-primary-500/20 text-primary-400' },
          { label: 'Report Incident', icon: MdAddAlert, path: '/commuter/report', color: 'bg-alert-orange/20 border-alert-orange/20 text-alert-orange' },
          { label: 'My Alerts', icon: MdNotificationsActive, path: '/commuter/alerts', color: 'bg-alert-red/20 border-alert-red/20 text-alert-red' },
        ].map(a => (
          <Link key={a.path} to={a.path}>
            <motion.div whileTap={{ scale: 0.96 }} className={`card border flex flex-col items-center justify-center py-5 gap-2 text-center cursor-pointer hover:bg-white/10 transition-all ${a.color}`}>
              <a.icon size={26} />
              <span className="text-xs font-medium text-white">{a.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Active alerts banner */}
      {activeAlerts.length > 0 && (
        <div className="card border border-alert-red/20 bg-alert-red/5">
          <div className="flex items-center gap-2 mb-3">
            <MdNotificationsActive size={18} className="text-alert-red animate-pulse" />
            <h3 className="section-title text-alert-red">Active Alerts Near You</h3>
          </div>
          <div className="space-y-2">
            {activeAlerts.map(a => (
              <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-black/20">
                <SeverityBadge severity={a.severity} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{a.type}</div>
                  <p className="text-xs text-surface-300 mt-0.5 leading-relaxed">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby bus routes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MdDirectionsBus size={18} className="text-primary-400" />
            <h3 className="section-title">Nearby Bus Routes</h3>
          </div>
          <Link to="/transport" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View all →</Link>
        </div>
        <div className="space-y-3">
          {nearbyRoutes.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                <MdDirectionsBus size={20} className="text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{r.name}</div>
                <div className="text-xs text-surface-300">{r.from} → {r.to}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <StatusBadge status={r.status} />
                <div className="text-xs text-surface-300 mt-1">Every {r.frequency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Road conditions */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MdSpeed size={18} className="text-alert-orange" />
          <h3 className="section-title">Congested Roads</h3>
        </div>
        <div className="space-y-2">
          {congested.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.congestion === 'critical' ? '#ef4444' : '#f97316' }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{r.name}</div>
                <div className="text-xs text-surface-300">{r.city}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-mono font-bold text-white">{r.speed} km/h</div>
                <div className="text-xs text-surface-300">{r.congestion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route suggestion */}
      <div className="card border border-primary-500/20 bg-primary-500/5">
        <div className="flex items-center gap-2 mb-3">
          <MdNavigation size={18} className="text-primary-400" />
          <h3 className="section-title">Suggested Route</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-surface-300">From</span><span className="text-white">Akwa, Douala</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-300">To</span><span className="text-white">Ndokotti, Douala</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-300">Best Route</span><span className="text-white">Via Rue Njo-Njo (avoid Ndokotti direct)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-300">Est. Time</span><span className="text-alert-green font-medium">22 min</span>
          </div>
        </div>
        <button className="btn-primary w-full mt-4 text-sm">Start Navigation</button>
      </div>
    </div>
  )
}
