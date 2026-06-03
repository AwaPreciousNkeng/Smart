import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdWarning, MdArrowBack, MdNotificationsActive, MdCheckCircle } from 'react-icons/md'

const ALERTS = [
  { id:1, type:'Storm Warning',    severity:'HIGH',     status:'active',    message:'Heavy rainfall expected 15h–18h across Douala and Yaoundé. Reduce speed and increase following distance. Avoid low-lying roads.', time:'09:00', area:'All Cities' },
  { id:2, type:'Accident Alert',   severity:'CRITICAL', status:'active',    message:'Major accident on Autoroute Douala–Yaoundé at PK50. Road partially blocked. Emergency services on site. Use N1 diversion.', time:'08:32', area:'Douala' },
  { id:3, type:'Flood Warning',    severity:'HIGH',     status:'active',    message:'Flash flooding at Ndokotti intersection. Avoid the area. Use Wouri bridge diversion. Roads expected to clear by 11h.', time:'06:55', area:'Douala' },
  { id:4, type:'Road Closure',     severity:'MEDIUM',   status:'monitoring',message:'Boulevard de la Liberté partially closed for emergency utility works. Expect delays. Estimated reopening 14h00.', time:'07:00', area:'Yaoundé' },
  { id:5, type:'Signal Fault',     severity:'MEDIUM',   status:'monitoring',message:'Traffic signal fault at Mvog-Mbi roundabout. Manual traffic control deployed. Drive carefully through the junction.', time:'11:48', area:'Yaoundé' },
  { id:6, type:'System Notice',    severity:'LOW',      status:'active',    message:'SmartRoad STTMS is operational. Thank you for using the commuter app. Report incidents to help fellow commuters.', time:'Now', area:'All' },
]

const sevColor = { LOW:'#16a34a', MEDIUM:'#ca8a04', HIGH:'#ea580c', CRITICAL:'#dc2626' }
const sevBadge = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-orange', CRITICAL:'badge-red' }

export default function CommuterAlertsPage() {
  const navigate  = useNavigate()
  const [filter,   setFilter]   = useState('all')
  const [dismissed, setDismissed] = useState(new Set())

  const filtered = ALERTS.filter(a => {
    if (dismissed.has(a.id)) return false
    if (filter === 'active')   return a.status === 'active'
    if (filter === 'critical') return a.severity === 'CRITICAL' || a.severity === 'HIGH'
    return true
  })

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/commuter')} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
          <MdArrowBack size={16} className="text-surface-300" />
        </button>
        <div>
          <h1 className="page-title">Emergency Alerts</h1>
          <p className="text-surface-300 text-sm mt-0.5">Stay informed about traffic alerts in Cameroon</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[['all','All'],['active','Active'],['critical','High / Critical']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === k ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            className="card border-l-4 py-4"
            style={{ borderLeftColor: sevColor[a.severity] }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <MdWarning size={16} color={sevColor[a.severity]} style={{ marginTop:2, flexShrink:0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-white font-semibold text-sm">{a.type}</span>
                    <span className={sevBadge[a.severity]} style={{ fontSize:9 }}>{a.severity}</span>
                    {a.status === 'active' && (
                      <span style={{ fontSize:9, fontWeight:700, color:'#dc2626', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:3, padding:'1px 5px' }}>ACTIVE</span>
                    )}
                  </div>
                  <p className="text-surface-200 text-sm leading-relaxed">{a.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-300">
                    <span>📍 {a.area}</span>
                    <span>🕐 {a.time}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDismissed(s => new Set([...s, a.id]))}
                className="text-xs text-surface-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-all flex-shrink-0 flex items-center gap-1">
                <MdCheckCircle size={11} /> Dismiss
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="card flex flex-col items-center justify-center py-14 text-center">
            <MdNotificationsActive size={36} className="text-surface-300 mb-2" />
            <div className="text-surface-300 text-sm">
              {dismissed.size > 0 ? 'All alerts dismissed' : 'No alerts match this filter'}
            </div>
            {dismissed.size > 0 && (
              <button onClick={() => setDismissed(new Set())} className="text-xs text-primary-400 mt-2 hover:text-primary-300">
                Restore dismissed alerts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}