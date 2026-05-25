import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdNotificationsActive, MdNotificationsOff, MdFilterList } from 'react-icons/md'
import { alerts } from '../../data/trafficData'
import { SeverityBadge } from '../../components/UIComponents'

const severityBg = {
  critical: 'border-l-alert-red bg-alert-red/5',
  high:     'border-l-alert-orange bg-alert-orange/5',
  medium:   'border-l-alert-yellow bg-alert-yellow/5',
  low:      'border-l-alert-green bg-alert-green/5',
}

export default function CommuterAlertsPage() {
  const [filter, setFilter] = useState('all')
  const [dismissed, setDismissed] = useState([])

  const visible = alerts.filter(a => {
    if (dismissed.includes(a.id)) return false
    if (filter === 'all') return true
    return a.severity === filter || a.city.toLowerCase().includes(filter)
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">My Alerts</h1>
          <p className="text-surface-300 text-sm mt-1">Traffic alerts and emergency broadcasts for your area</p>
        </div>
        <span className={`badge-${visible.length > 0 ? 'red' : 'green'} text-xs`}>
          {visible.length} active
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all','critical','high','medium','douala','yaoundé'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {visible.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className={`card border-l-4 ${severityBg[a.severity]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <MdNotificationsActive size={14} className="text-alert-orange" />
                  <span className="font-display font-semibold text-white text-sm">{a.type}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <p className="text-sm text-surface-200 leading-relaxed">{a.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-surface-300">
                  <span>📍 {a.city}</span>
                  <span>🕐 {a.time}</span>
                  <span>👥 {a.recipients.toLocaleString()} notified</span>
                </div>
              </div>
              <button onClick={() => setDismissed(d => [...d, a.id])}
                className="text-xs text-surface-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-all flex-shrink-0">
                Dismiss
              </button>
            </div>
          </motion.div>
        ))}

        {visible.length === 0 && (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <MdNotificationsOff size={40} className="text-surface-300 mb-3" />
            <div className="font-display font-semibold text-white">No alerts</div>
            <p className="text-sm text-surface-300 mt-1">You're all clear! No active alerts for your area.</p>
          </div>
        )}
      </div>

      {dismissed.length > 0 && (
        <button onClick={() => setDismissed([])} className="btn-ghost text-xs w-full">
          Restore {dismissed.length} dismissed alert{dismissed.length > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}
