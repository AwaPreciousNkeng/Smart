import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  MdDirectionsCar, MdWarning, MdSpeed, MdSensors,
  MdFiberManualRecord, MdDirectionsBus, MdArrowForward,
  MdTrendingUp, MdTrendingDown, MdLocationOn, MdAccessTime,
  MdCheckCircle, MdPsychology, MdRefresh, MdNotificationsActive
} from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { hourlyTraffic, weeklyData, incidents, alerts } from '../../data/trafficData'
import { allRoads, cameroonCities } from '../../data/cameroonCities'

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

const congColor = { low:'#16a34a', medium:'#ca8a04', high:'#ea580c', critical:'#dc2626' }
const sevBadge  = { low:'badge-green', medium:'badge-yellow', high:'badge-orange', critical:'badge-red' }
const congBadge = { low:'badge-green', medium:'badge-yellow', high:'badge-orange', critical:'badge-red' }

const kpis = [
  { label:'Vehicles Today',    value:'47,832', icon:MdDirectionsCar,     color:'blue',   trend:+12, sub:'Across all monitored cities', border:'#2563eb' },
  { label:'Active Incidents',  value:null,     icon:MdWarning,           color:'red',    trend:+3,  sub:'2 critical unresolved',        border:'#dc2626' },
  { label:'Avg Speed (km/h)',  value:'38',     icon:MdSpeed,             color:'green',  trend:-5,  sub:'All monitored corridors',       border:'#16a34a' },
  { label:'Sensors Online',    value:'6 / 8',  icon:MdSensors,           color:'yellow', trend:0,   sub:'2 offline or faulting',         border:'#ca8a04' },
  { label:'Traffic Lights',    value:'6',      icon:MdFiberManualRecord, color:'blue',   trend:0,   sub:'1 fault · 1 emergency',         border:'#2563eb' },
  { label:'Bus Routes Active', value:'4 / 6',  icon:MdDirectionsBus,     color:'green',  trend:0,   sub:'1 delayed · 1 disrupted',       border:'#16a34a' },
  { label:'Active Alerts',     value:null,     icon:MdNotificationsActive,color:'red',   trend:+2,  sub:'Broadcast + active',            border:'#dc2626' },
  { label:'Cities Monitored',  value:'5',      icon:MdLocationOn,        color:'blue',   trend:0,   sub:'Buea, Limbe, Douala, Yde, Bda', border:'#2563eb' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  const activeInc = incidents.filter(i => i.status !== 'Resolved')
  const activeAlt = alerts.filter(a => a.status === 'active')

  const resolvedKpis = kpis.map(k => ({
    ...k,
    value: k.value ?? (k.label === 'Active Incidents' ? String(activeInc.length) : String(activeAlt.length)),
  }))

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Header */}
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
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
          <button className="btn btn-ghost btn-sm" style={{gap:5}}>
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
            Based on current traffic patterns, expect <strong>peak congestion on the Autoroute Douala–Yaoundé between 17:00–18:30</strong>. Recommend activating adaptive signal override at Carrefour Ndokotti. Buea–Mutengene Highway is operating normally.
          </span>
        </div>
        <Link to="/ai" style={{ fontSize:12, fontWeight:600, color:'#2563eb', textDecoration:'none', flexShrink:0 }}>Ask AI →</Link>
      </motion.div>

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:12 }}>
        {resolvedKpis.map((k, i) => (
          <motion.div key={k.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
            className="stat-card" style={{ borderLeftColor:k.border }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ width:32, height:32, borderRadius:5, background: k.border+'15', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <k.icon size={17} color={k.border} />
              </div>
              {k.trend !== 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, fontWeight:600, color:k.trend>0?'#b91c1c':'#15803d' }}>
                  {k.trend>0 ? <MdTrendingUp size={12}/> : <MdTrendingDown size={12}/>}
                  {Math.abs(k.trend)}%
                </div>
              )}
            </div>
            <div className="value-lg" style={{ marginTop:8 }}>{k.value}</div>
            <div className="label-xs" style={{ marginTop:3 }}>{k.label}</div>
            <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>

        {/* Hourly traffic */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.5}} className="card" style={{padding:0}}>
          <div className="card-header">
            <div>
              <div className="section-title">Hourly Traffic Volume</div>
              <div style={{fontSize:12,color:'#9ca3af',marginTop:1}}>Today — vehicles and incidents across monitored corridors</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {['Today','Week','Month'].map(p=>(
                <button key={p} className="btn btn-ghost btn-xs">{p}</button>
              ))}
            </div>
          </div>
          <div style={{padding:'16px 18px'}}>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={hourlyTraffic}>
                <defs>
                  <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8"/>
                <XAxis dataKey="time" tick={{fill:'#9ca3af',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#9ca3af',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tooltip2/>}/>
                <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke="#2563eb" fill="url(#gv)" strokeWidth={2} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly bar */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.55}} className="card" style={{padding:0}}>
          <div className="card-header">
            <div>
              <div className="section-title">Weekly Comparison</div>
              <div style={{fontSize:12,color:'#9ca3af',marginTop:1}}>Douala vs Yaoundé</div>
            </div>
          </div>
          <div style={{padding:'16px 18px'}}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={weeklyData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8"/>
                <XAxis dataKey="day" tick={{fill:'#9ca3af',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#9ca3af',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tooltip2/>}/>
                <Bar dataKey="douala"  name="Douala"  fill="#2563eb" radius={[3,3,0,0]}/>
                <Bar dataKey="yaounde" name="Yaoundé" fill="#60a5fa" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>

        {/* Active incidents */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="card" style={{padding:0}}>
          <div className="card-header">
            <div className="section-title">Active Incidents</div>
            <Link to="/incidents" style={{fontSize:12,color:'#2563eb',textDecoration:'none',fontWeight:500,display:'flex',alignItems:'center',gap:3}}>
              All incidents <MdArrowForward size={13}/>
            </Link>
          </div>
          <div>
            {activeInc.slice(0,5).map(inc => (
              <div key={inc.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 16px',borderBottom:'1px solid #f3f6fa'}}>
                <div style={{width:3,borderRadius:99,background:congColor[inc.severity]||'#ca8a04',alignSelf:'stretch',flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:600,color:'#0f1923'}}>{inc.type}</span>
                    <span className={`badge ${sevBadge[inc.severity]}`}>{inc.severity}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#6b7280'}}>
                    <MdLocationOn size={11}/> {inc.road} · {inc.city}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#9ca3af',marginTop:2}}>
                    <MdAccessTime size={11}/> {inc.time} · {inc.date}
                  </div>
                </div>
              </div>
            ))}
            {activeInc.length === 0 && (
              <div style={{padding:'24px 16px',display:'flex',alignItems:'center',gap:8,color:'#16a34a'}}>
                <MdCheckCircle size={18}/> <span style={{fontSize:13,fontWeight:500}}>No active incidents</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Road status — all monitored cities */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.65}} className="card" style={{padding:0}}>
          <div className="card-header">
            <div className="section-title">Road Corridor Status</div>
            <Link to="/live-traffic" style={{fontSize:12,color:'#2563eb',textDecoration:'none',fontWeight:500,display:'flex',alignItems:'center',gap:3}}>
              Live map <MdArrowForward size={13}/>
            </Link>
          </div>
          <div style={{overflowY:'auto',maxHeight:300}}>
            {allRoads.map(r => (
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',borderBottom:'1px solid #f3f6fa'}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:congColor[r.congestion],flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:'#0f1923',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</div>
                  <div style={{fontSize:11,color:'#9ca3af'}}>{r.city} · {r.region}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                  <div style={{width:70}}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{width:`${r.density}%`,background:congColor[r.congestion]}}/>
                    </div>
                  </div>
                  <span className="mono" style={{fontSize:11,color:'#6b7280',width:52,textAlign:'right'}}>{r.speed} km/h</span>
                  <span className={`badge ${congBadge[r.congestion]}`} style={{fontSize:10}}>{r.congestion}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
