import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { MdTrendingUp, MdTrendingDown, MdBarChart, MdWarning, MdDirectionsCar } from 'react-icons/md'
import { incidentsAPI, vehiclesAPI } from '../../services/api'

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #dce4ef', borderRadius:6, padding:'9px 12px', fontSize:12, boxShadow:'0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight:600, color:'#0f1923', marginBottom:5 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:p.fill || p.color }} />
          <span style={{ color:'#6b7280' }}>{p.name}:</span>
          <span style={{ fontWeight:600, color:'#0f1923' }}>{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}
const sevColor  = { LOW:'#16a34a', MEDIUM:'#ca8a04', HIGH:'#ea580c', CRITICAL:'#dc2626' }
const statColor = { OPEN:'#dc2626', ACKNOWLEDGED:'#ca8a04', IN_RESPONSE:'#ea580c', RESOLVED:'#16a34a', CLOSED:'#2563eb', CANCELLED:'#9ca3af' }
const catColor  = { TAXI:'#2563eb', BUS:'#16a34a', MINI_BUS:'#7c3aed', EMERGENCY:'#dc2626', MOTORCYCLE:'#ea580c', PRIVATE:'#9ca3af' }

export default function AnalyticsPage() {
  const [incidents, setIncidents] = useState([])
  const [vehicles,  setVehicles]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.allSettled([incidentsAPI.getAll(), vehiclesAPI.getAll()])
      .then(([inc, veh]) => {
        if (inc.status === 'fulfilled') setIncidents(inc.value.data)
        if (veh.status === 'fulfilled') setVehicles(veh.value.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const bySeverity = ['CRITICAL','HIGH','MEDIUM','LOW'].map(s => ({
    name: s.charAt(0) + s.slice(1).toLowerCase(),
    count: incidents.filter(i => i.severity === s).length,
    fill: sevColor[s],
  }))

  const byStatus = ['OPEN','ACKNOWLEDGED','IN_RESPONSE','RESOLVED','CLOSED'].map(s => ({
    name: s.charAt(0) + s.slice(1).toLowerCase().replace('_',' '),
    count: incidents.filter(i => i.status === s).length,
    fill: statColor[s],
  }))

  const byType = Object.keys(typeLabel).map(t => ({
    name: typeLabel[t],
    count: incidents.filter(i => i.type === t).length,
  })).filter(x => x.count > 0)

  const byVehicleCat = ['TAXI','BUS','MINI_BUS','EMERGENCY','MOTORCYCLE','PRIVATE'].map(c => ({
    name: c.charAt(0) + c.slice(1).toLowerCase().replace('_',' '),
    count: vehicles.filter(v => v.category === c).length,
    fill: catColor[c],
  })).filter(x => x.count > 0)

  const activeInc   = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'CANCELLED').length
  const resolvedInc = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length
  const criticalInc = incidents.filter(i => i.severity === 'CRITICAL').length
  const enRouteVeh  = vehicles.filter(v => v.status === 'EN_ROUTE').length

  const kpis = [
    { label:'Total Incidents',  value: String(incidents.length),  icon:MdWarning,       color:'#dc2626', sub:'All recorded' },
    { label:'Active Now',       value: String(activeInc),         icon:MdTrendingUp,    color:'#ea580c', sub:'Unresolved' },
    { label:'Resolved',         value: String(resolvedInc),       icon:MdTrendingDown,  color:'#16a34a', sub:'Closed/resolved' },
    { label:'Critical',         value: String(criticalInc),       icon:MdBarChart,      color:'#dc2626', sub:'Highest severity' },
    { label:'Total Vehicles',   value: String(vehicles.length),   icon:MdDirectionsCar, color:'#2563eb', sub:'Registered' },
    { label:'En Route',         value: String(enRouteVeh),        icon:MdDirectionsCar, color:'#7c3aed', sub:'Currently active' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="text-surface-300 text-sm mt-1">Incident and vehicle statistics from live data</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            className="card text-center py-3">
            <div className="value-text text-2xl" style={{ color: k.color }}>
              {loading ? '…' : k.value}
            </div>
            <div className="text-xs font-medium text-white mt-1">{k.label}</div>
            <div className="text-xs text-surface-300 mt-0.5">{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* By Severity */}
        <div className="card">
          <div className="section-title mb-4">Incidents by Severity</div>
          {loading ? (
            <div className="text-surface-300 text-sm py-8 text-center">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bySeverity} margin={{ left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="count" name="Incidents" radius={[4,4,0,0]}>
                  {bySeverity.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* By Status */}
        <div className="card">
          <div className="section-title mb-4">Incidents by Status</div>
          {loading ? (
            <div className="text-surface-300 text-sm py-8 text-center">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byStatus} margin={{ left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fill:'#6b7280', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="count" name="Incidents" radius={[4,4,0,0]}>
                  {byStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* By Type */}
        <div className="card">
          <div className="section-title mb-4">Incidents by Type</div>
          {loading ? (
            <div className="text-surface-300 text-sm py-8 text-center">Loading…</div>
          ) : byType.length === 0 ? (
            <div className="text-surface-300 text-sm py-8 text-center">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byType} layout="vertical" margin={{ left:10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CT />} />
                <Bar dataKey="count" name="Count" fill="#2563eb" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Vehicles by Category */}
        <div className="card">
          <div className="section-title mb-4">Vehicles by Category</div>
          {loading ? (
            <div className="text-surface-300 text-sm py-8 text-center">Loading…</div>
          ) : byVehicleCat.length === 0 ? (
            <div className="text-surface-300 text-sm py-8 text-center">No vehicles registered</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byVehicleCat} margin={{ left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="count" name="Vehicles" radius={[4,4,0,0]}>
                  {byVehicleCat.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}