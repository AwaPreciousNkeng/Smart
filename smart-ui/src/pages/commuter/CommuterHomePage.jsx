import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdWarning, MdLocationOn, MdAdd, MdArrowForward, MdNotificationsActive } from 'react-icons/md'
import { incidentsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const sevColor = { LOW:'#16a34a', MEDIUM:'#ca8a04', HIGH:'#ea580c', CRITICAL:'#dc2626' }
const sevBadge = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-orange', CRITICAL:'badge-red' }

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}

const STATIC_ALERTS = [
  { id:1, type:'Storm Warning',  severity:'high',     message:'Heavy rainfall expected 15h–18h. Reduce speed and increase following distance.', time:'09:00' },
  { id:2, type:'Road Closure',   severity:'medium',   message:'Boulevard de la Liberté partially closed for emergency works. Expect delays until 14h.', time:'07:00' },
  { id:3, type:'System Notice',  severity:'low',      message:'SmartRoad STTMS is live and monitoring. Report incidents to help other commuters.', time:'Now' },
]

export default function CommuterHomePage() {
  const { user } = useAuth()
  const [myReports, setMyReports] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    incidentsAPI.getMyReported()
      .then(r => setMyReports(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Commuter Portal</h1>
        <p className="text-surface-300 text-sm mt-1">
          Welcome, {user?.name?.split(' ')[0]} — report incidents and stay informed
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/commuter/report"
          className="card flex flex-col items-center justify-center py-6 gap-3 hover:bg-primary-500/10 border border-primary-500/20 transition-all cursor-pointer no-underline">
          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
            <MdAdd size={22} color="#2563eb" />
          </div>
          <span className="text-white font-semibold text-sm">Report Incident</span>
          <span className="text-surface-300 text-xs text-center">Submit a new traffic incident</span>
        </Link>
        <Link to="/commuter/alerts"
          className="card flex flex-col items-center justify-center py-6 gap-3 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer no-underline">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <MdNotificationsActive size={22} color="#dc2626" />
          </div>
          <span className="text-white font-semibold text-sm">View Alerts</span>
          <span className="text-surface-300 text-xs text-center">Emergency alerts &amp; notices</span>
        </Link>
      </div>

      {/* Active system alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Active Alerts</h2>
          <Link to="/commuter/alerts" className="text-xs text-primary-400 flex items-center gap-1 hover:text-primary-300">
            View all <MdArrowForward size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {STATIC_ALERTS.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }}
              className={`card border-l-4 py-3`} style={{ borderLeftColor: sevColor[a.severity.toUpperCase()] || '#ca8a04' }}>
              <div className="flex items-start gap-2">
                <MdWarning size={14} color={sevColor[a.severity.toUpperCase()] || '#ca8a04'} style={{ marginTop:2, flexShrink:0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-sm">{a.type}</span>
                    <span className={sevBadge[a.severity.toUpperCase()] || 'badge-blue'} style={{ fontSize:9 }}>{a.severity}</span>
                  </div>
                  <p className="text-surface-300 text-xs leading-relaxed">{a.message}</p>
                </div>
                <span className="text-xs text-surface-300 flex-shrink-0">{a.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* My reported incidents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">My Reports</h2>
          <span className="text-xs text-surface-300">{myReports.length} total</span>
        </div>
        {loading ? (
          <div className="card py-8 text-center text-surface-300 text-sm">Loading your reports…</div>
        ) : myReports.length === 0 ? (
          <div className="card py-8 text-center">
            <MdWarning size={28} className="text-surface-300 mx-auto mb-2" />
            <div className="text-surface-300 text-sm">No reports yet</div>
            <Link to="/commuter/report" className="text-xs text-primary-400 mt-1 block">Report your first incident →</Link>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            {myReports.slice(0, 8).map((inc, i) => (
              <motion.div key={inc.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.04 }}
                className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div style={{ width:3, borderRadius:99, background: sevColor[inc.severity] || '#ca8a04', alignSelf:'stretch', flexShrink:0 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-sm">{typeLabel[inc.type] || inc.type}</span>
                    <span className={`${sevBadge[inc.severity] || 'badge-blue'}`} style={{ fontSize:9 }}>{inc.severity}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-surface-300">
                    <MdLocationOn size={11} /> {inc.locationName || `${inc.lat?.toFixed(3)}, ${inc.lon?.toFixed(3)}`}
                  </div>
                </div>
                <span className="text-xs text-surface-300 flex-shrink-0">
                  {inc.reportedAt ? new Date(inc.reportedAt).toLocaleDateString('en-GB') : '—'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}