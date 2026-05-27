import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdNotificationsActive, MdSms, MdBroadcastOnHome, MdAdd, MdHistory } from 'react-icons/md'
import { SeverityBadge, StatusBadge, Modal } from '../../components/UIComponents'

const STATIC_ALERTS = [
  { id:1, type:'Accident Alert',  severity:'critical', status:'active',     message:'Major accident on Autoroute Douala–Yaoundé at PK50. Road partially blocked. Emergency services on site.', city:'Douala',   time:'08:32', date:'Today',  recipients:2400 },
  { id:2, type:'Flood Warning',   severity:'high',     status:'active',     message:'Flash flooding reported at Ndokotti intersection. Avoid the area and use Wouri bridge diversion.',            city:'Douala',   time:'06:55', date:'Today',  recipients:1800 },
  { id:3, type:'Road Closure',    severity:'medium',   status:'monitoring', message:'Boulevard de la Liberté partially closed for emergency utility works. Expect delays until 14h.',              city:'Yaoundé',  time:'07:00', date:'Today',  recipients:950  },
  { id:4, type:'Signal Fault',    severity:'medium',   status:'monitoring', message:'Traffic signal fault at Mvog-Mbi roundabout. Manual traffic control deployed.',                               city:'Yaoundé',  time:'11:48', date:'Today',  recipients:630  },
  { id:5, type:'Storm Warning',   severity:'high',     status:'active',     message:'METEO CAM: Heavy rainfall expected 15h–18h. Reduce speed and increase following distance.',                   city:'All Cities',time:'09:00', date:'Today', recipients:5200 },
]

const severityColor = {
  critical: 'border-l-alert-red bg-alert-red/5',
  high:     'border-l-alert-orange bg-alert-orange/5',
  medium:   'border-l-alert-yellow bg-alert-yellow/5',
  low:      'border-l-alert-green bg-alert-green/5',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(STATIC_ALERTS)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter || a.status === filter)

  const dismiss = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'dismissed' } : a))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Emergency Alert Center</h1>
          <p className="text-surface-300 text-sm mt-1">Broadcast emergency alerts and manage SMS notifications</p>
        </div>
        <button onClick={() => setBroadcastOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <MdBroadcastOnHome size={18} /> New Broadcast
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Alerts',     value: alerts.filter(a => a.status === 'active').length,    border: 'border-alert-red/30' },
          { label: 'Broadcast Reach',   value: alerts.reduce((s,a) => s+a.recipients, 0).toLocaleString(), border: 'border-primary-500/30' },
          { label: 'Monitoring',        value: alerts.filter(a => a.status === 'monitoring').length, border: 'border-alert-yellow/30' },
          { label: 'Total Alerts Today',value: alerts.length,                                        border: 'border-alert-green/30' },
        ].map(s => (
          <div key={s.label} className={`card border text-center ${s.border}`}>
            <div className="value-text text-2xl">{s.value}</div>
            <div className="label-text mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all','active','monitoring','critical','high','medium','broadcast'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Alert list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className={`card border-l-4 ${severityColor[a.severity]} hover:bg-white/8 transition-all`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-display font-semibold text-white text-sm">{a.type}</span>
                    <SeverityBadge severity={a.severity} />
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-sm text-surface-200 leading-relaxed">{a.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-300">
                    <span>📍 {a.city}</span>
                    <span>🕐 {a.time} · {a.date}</span>
                    <span>👥 {a.recipients.toLocaleString()} notified</span>
                  </div>
                </div>
                {a.status !== 'dismissed' && (
                  <button onClick={() => dismiss(a.id)}
                    className="text-xs text-surface-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-all flex-shrink-0">
                    Dismiss
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="card flex flex-col items-center justify-center py-14 text-center">
              <MdNotificationsActive size={36} className="text-surface-300 mb-2" />
              <div className="text-surface-300">No alerts match this filter</div>
            </div>
          )}
        </div>

        {/* SMS Mockup Panel */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <MdSms size={18} className="text-primary-400" />
              <h3 className="section-title">SMS Notification Log</h3>
            </div>
            <div className="space-y-3">
              {[
                { to: '+237 677 ***',  msg: 'STTMS ALERT: Accident on Autoroute DLA-YDE. Avoid area.', time: '08:34', sent: true },
                { to: '+237 699 ***',  msg: 'STTMS: Flooding at Ndokotti. Use Wouri diversion.', time: '06:55', sent: true },
                { to: 'All Douala',    msg: 'STTMS: Boulevard Liberté partially closed until 14h.', time: '07:00', sent: true },
                { to: 'All Yaoundé',   msg: 'STTMS: Signal fault at Mvog-Mbi. Expect delays.', time: '11:48', sent: true },
                { to: 'All Cities',    msg: 'STTMS WEATHER: Heavy rain 15h-18h. Drive carefully.', time: '09:00', sent: true },
              ].map((sms, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-900/50 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-primary-400">{sms.to}</span>
                    <div className="flex items-center gap-1 text-xs text-alert-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-alert-green" />
                      Sent {sms.time}
                    </div>
                  </div>
                  <p className="text-xs text-surface-300 leading-relaxed">{sms.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alert History */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <MdHistory size={16} className="text-surface-300" />
              <h3 className="section-title text-sm">Alert History</h3>
            </div>
            <div className="space-y-2">
              {['INC-001 Resolved — Jun 11 14:30', 'INC-007 Resolved — Jun 11 15:00', 'BR-06 Disruption — Jun 11 09:00'].map((h,i) => (
                <div key={i} className="text-xs text-surface-300 flex items-center gap-2 py-1 border-b border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-300 flex-shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      <Modal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} title="Broadcast Emergency Alert" wide>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-1.5">Alert Type</label>
              <select className="input-field">
                <option>Accident Alert</option>
                <option>Flood Warning</option>
                <option>Road Closure</option>
                <option>Security Alert</option>
                <option>Storm Warning</option>
                <option>Signal Fault</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="label-text block mb-1.5">Severity</label>
              <select className="input-field">
                <option>critical</option>
                <option>high</option>
                <option>medium</option>
                <option>low</option>
              </select>
            </div>
            <div>
              <label className="label-text block mb-1.5">Target Area</label>
              <select className="input-field">
                <option>All Cities</option>
                <option>Douala Only</option>
                <option>Yaoundé Only</option>
                <option>Specific Road</option>
              </select>
            </div>
            <div>
              <label className="label-text block mb-1.5">Notification Channel</label>
              <select className="input-field">
                <option>App + SMS</option>
                <option>App Only</option>
                <option>SMS Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-text block mb-1.5">Alert Message</label>
            <textarea className="input-field resize-none" rows={4} placeholder="Type your emergency broadcast message here…" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setBroadcastOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={() => setBroadcastOpen(false)} className="btn-primary flex-1 flex items-center gap-2 justify-center">
              <MdBroadcastOnHome size={16} /> Send Broadcast
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
