import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdDirectionsCar, MdWarning, MdCheckCircle, MdLocationOn, MdAccessTime,
  MdArrowForward, MdTrendingUp, MdPsychology, MdRefresh, MdNotificationsActive,
} from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { incidentsAPI, vehiclesAPI } from '../../services/api'

const sevColor = { LOW:'#16a34a', MEDIUM:'#ca8a04', HIGH:'#ea580c', CRITICAL:'#dc2626' }
const sevBadge = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-orange', CRITICAL:'badge-red' }

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}

const Tooltip2 = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #dce4ef', borderRadius:6, padding:'9px 12px', fontSize:12, boxShadow:'0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight:600, color:'#0f1923', marginBottom:5 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:p.color }} />
          <span style={{ color:'#6b7280' }}>{p.name}:</span>
          <span style={{ fontWeight:600, color:'#0f1923' }}>{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [time,      setTime]      = useState(new Date())
  const [incidents, setIncidents] = useState([])
  const [vehicles,  setVehicles]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fetchData = () => {
    setLoading(true)
    const isCommuter = user?.role === 'Commuter'
    Promise.allSettled([
      isCommuter ? incidentsAPI.getMyReported() : incidentsAPI.getAll(),
      vehiclesAPI.getAll(),
    ]).then(([incRes, vehRes]) => {
      if (incRes.status === 'fulfilled') setIncidents(incRes.value.data)
      if (vehRes.status === 'fulfilled') setVehicles(vehRes.value.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const activeInc  = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'CANCELLED')
  const criticalInc= incidents.filter(i => i.severity === 'CRITICAL')
  const resolvedInc= incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED')

  const kpis = [
    { label:'Active Incidents', value: loading ? '…' : String(activeInc.length),  icon:MdWarning,           border:'#dc2626', sub:'Currently unresolved' },
    { label:'Critical',         value: loading ? '…' : String(criticalInc.length), icon:MdNotificationsActive,border:'#ea580c', sub:'Highest severity' },
    { label:'Resolved Today',   value: loading ? '…' : String(resolvedInc.length), icon:MdCheckCircle,        border:'#16a34a', sub:'Closed incidents' },
    { label:'Total Vehicles',   value: loading ? '…' : String(vehicles.length),    icon:MdDirectionsCar,      border:'#2563eb', sub:'Registered in system' },
    { label:'En Route',         value: loading ? '…' : String(vehicles.filter(v=>v.status==='EN_ROUTE').length), icon:MdTrendingUp, border:'#2563eb', sub:'Currently active vehicles' },
    { label:'Total Reports',    value: loading ? '…' : String(incidents.length),   icon:MdLocationOn,          border:'#7c3aed', sub:'All incidents recorded' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Header */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
        style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <div className="page-title">
            {time.getHours()<12?'Good morning':time.getHours()<17?'Good afternoon':'Good evening'}, {user?.name?.split(' ')[0]}
          </div>
          <div className="page-sub">
            {time.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} ·{' '}
            <span className="mono" style={{color:'#9ca3af'}}>{time.toLocaleTimeString('en-GB')}</span> ·{' '}
            SmartRoad Cameroun — {activeInc.length} active incident{activeInc.length!==1?'s':''}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {activeInc.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:4, background:'#fef2f2', border:'1px solid #fecaca' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#dc2626', animation:'pulse-dot 2s infinite' }} />
              <span style={{ fontSize:12, fontWeight:600, color:'#b91c1c' }}>{activeInc.length} Active</span>
            </div>
          )}
          <button onClick={fetchData} className="btn btn-ghost btn-sm" style={{gap:5}}>
            <MdRefresh size={13} /> Refresh
          </button>
        </div>
      </motion.div>

      {/* AI Insight strip */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderRadius:6, background:'#eff6ff', border:'1px solid #bfdbfe' }}>
        <MdPsychology size={20} color="#2563eb" style={{ flexShrink:0 }} />
        <div>
          <span style={{ fontSize:12, fontWeight:700, color:'#1d4ed8' }}>AI Insight · </span>
          <span style={{ fontSize:12, color:'#374151' }}>
            SmartRoad AI is connected. Ask it to analyse incident trends, suggest diversion routes, or summarise current traffic conditions.
          </span>
        </div>
        <Link to="/ai" style={{ fontSize:12, fontWeight:600, color:'#2563eb', textDecoration:'none', flexShrink:0 }}>Ask AI →</Link>
      </motion.div>

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:12 }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
            className="stat-card" style={{ borderLeftColor:k.border }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ width:32, height:32, borderRadius:5, background:k.border+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <k.icon size={17} color={k.border} />
              </div>
            </div>
            <div className="value-lg" style={{ marginTop:8 }}>{k.value}</div>
            <div className="label-xs" style={{ marginTop:3 }}>{k.label}</div>
            <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* Active incidents list */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="card" style={{padding:0}}>
          <div className="card-header">
            <div className="section-title">Active Incidents</div>
            <Link to="/incidents" style={{fontSize:12,color:'#2563eb',textDecoration:'none',fontWeight:500,display:'flex',alignItems:'center',gap:3}}>
              All <MdArrowForward size={13}/>
            </Link>
          </div>
          <div>
            {loading ? (
              <div style={{padding:'24px 16px',fontSize:13,color:'#9ca3af'}}>Loading…</div>
            ) : activeInc.length === 0 ? (
              <div style={{padding:'24px 16px',display:'flex',alignItems:'center',gap:8,color:'#16a34a'}}>
                <MdCheckCircle size={18}/> <span style={{fontSize:13,fontWeight:500}}>No active incidents</span>
              </div>
            ) : activeInc.slice(0,6).map(inc => (
              <div key={inc.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 16px',borderBottom:'1px solid #f3f6fa'}}>
                <div style={{width:3,borderRadius:99,background:sevColor[inc.severity]||'#ca8a04',alignSelf:'stretch',flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:600,color:'#0f1923'}}>{typeLabel[inc.type] || inc.type}</span>
                    <span className={`badge ${sevBadge[inc.severity] || 'badge-blue'}`}>{inc.severity}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#6b7280'}}>
                    <MdLocationOn size={11}/> {inc.locationName || `${inc.lat?.toFixed(3)}, ${inc.lon?.toFixed(3)}`}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#9ca3af',marginTop:2}}>
                    <MdAccessTime size={11}/> {inc.reportedAt ? new Date(inc.reportedAt).toLocaleString('en-GB') : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Incident breakdown by severity */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.45}} className="card" style={{padding:0}}>
          <div className="card-header">
            <div className="section-title">Incident Breakdown</div>
            <Link to="/incidents" style={{fontSize:12,color:'#2563eb',textDecoration:'none',fontWeight:500,display:'flex',alignItems:'center',gap:3}}>
              Manage <MdArrowForward size={13}/>
            </Link>
          </div>
          <div style={{padding:'16px'}}>
            {loading ? (
              <div style={{fontSize:13,color:'#9ca3af'}}>Loading…</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {['CRITICAL','HIGH','MEDIUM','LOW'].map(sev => {
                  const count = incidents.filter(i => i.severity === sev).length
                  const pct   = incidents.length ? Math.round(count / incidents.length * 100) : 0
                  return (
                    <div key={sev}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:12,fontWeight:600,color:sevColor[sev]}}>{sev.charAt(0)+sev.slice(1).toLowerCase()}</span>
                        <span style={{fontSize:12,color:'#6b7280'}}>{count} · {pct}%</span>
                      </div>
                      <div style={{height:6,borderRadius:4,background:'#f3f6fa',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${pct}%`,background:sevColor[sev],borderRadius:4,transition:'width 0.5s'}}/>
                      </div>
                    </div>
                  )
                })}

                <div style={{marginTop:8,paddingTop:12,borderTop:'1px solid #f3f6fa'}}>
                  <div style={{fontSize:12,fontWeight:600,color:'#0f1923',marginBottom:8}}>By Status</div>
                  {['OPEN','ACKNOWLEDGED','IN_RESPONSE','RESOLVED'].map(st => {
                    const count = incidents.filter(i => i.status === st).length
                    return (
                      <div key={st} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid #f9fafb'}}>
                        <span style={{fontSize:12,color:'#6b7280'}}>{st.charAt(0)+st.slice(1).toLowerCase().replace('_',' ')}</span>
                        <span style={{fontSize:12,fontWeight:600,color:'#0f1923'}}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}