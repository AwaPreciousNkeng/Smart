import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSensors, MdSignalWifi4Bar, MdSignalWifiOff, MdWarning, MdRefresh } from 'react-icons/md'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { sensors } from '../../data/trafficData'
import { StatusBadge, StatusPulse, ChartCard } from '../../components/UIComponents'

// Generate sparkline data for each sensor
const genSpark = (base, variance = 20) =>
  Array.from({ length: 12 }, (_, i) => ({
    t: `${i * 5}m`,
    v: Math.max(0, base + (Math.random() - 0.5) * variance),
  }))

const sensorCharts = {
  'S-001': genSpark(312, 60),
  'S-002': genSpark(188, 40),
  'S-003': genSpark(45, 10),
  'S-005': genSpark(421, 80),
  'S-007': genSpark(265, 50),
  'S-008': genSpark(22, 8),
}

const typeIcon = { Camera: '📷', 'Loop Detector': '🔁', 'Air Quality': '🌫️', Weather: '🌤️' }

const statusBg = {
  online:  'border-alert-green/20 bg-alert-green/5',
  offline: 'border-alert-red/20 bg-alert-red/5',
  fault:   'border-alert-orange/20 bg-alert-orange/5',
}

export default function SensorsPage() {
  const [selected, setSelected] = useState(null)
  const [cityFilter, setCityFilter] = useState('all')

  const filtered = cityFilter === 'all' ? sensors : sensors.filter(s => s.city === cityFilter)
  const sel = sensors.find(s => s.id === selected)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">IoT Sensor Monitoring</h1>
          <p className="text-surface-300 text-sm mt-1">Real-time sensor health, data streams and diagnostics</p>
        </div>
        <div className="flex gap-2">
          {['all','Douala','Yaoundé'].map(c => (
            <button key={c} onClick={() => setCityFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cityFilter === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
              {c === 'all' ? 'All Cities' : c}
            </button>
          ))}
          <button className="btn-ghost text-xs flex items-center gap-1.5">
            <MdRefresh size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Online',  value: sensors.filter(s => s.status === 'online').length,  color: 'border-alert-green/30', text: 'text-alert-green' },
          { label: 'Offline', value: sensors.filter(s => s.status === 'offline').length, color: 'border-alert-red/30',   text: 'text-alert-red' },
          { label: 'Fault',   value: sensors.filter(s => s.status === 'fault').length,   color: 'border-alert-orange/30',text: 'text-alert-orange' },
        ].map(s => (
          <div key={s.label} className={`card border text-center ${s.color}`}>
            <div className={`value-text text-3xl ${s.text}`}>{s.value}</div>
            <div className="label-text mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sensor cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3 content-start">
          {filtered.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              className={`card border cursor-pointer transition-all hover:bg-white/8 ${s.id === selected ? 'border-primary-500/50' : statusBg[s.status]}`}>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono text-primary-400 text-xs">{s.id}</div>
                  <div className="font-display font-semibold text-white text-sm mt-0.5">
                    {typeIcon[s.type]} {s.type}
                  </div>
                  <div className="text-xs text-surface-300 mt-0.5 truncate max-w-[160px]">{s.location}</div>
                </div>
                <StatusPulse status={s.status} />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <StatusBadge status={s.status} />
                <span className="text-xs text-surface-300">Ping: {s.lastPing}</span>
              </div>

              {/* Battery */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="label-text">Battery</span>
                  <span className={`text-xs font-mono font-bold ${s.battery < 20 ? 'text-alert-red' : s.battery < 50 ? 'text-alert-yellow' : 'text-alert-green'}`}>{s.battery}%</span>
                </div>
                <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${s.battery}%`,
                      background: s.battery < 20 ? '#ef4444' : s.battery < 50 ? '#f59e0b' : '#22c55e'
                    }} />
                </div>
              </div>

              {/* Data readout */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(s.data).map(([k, v]) => (
                  <div key={k} className="bg-surface-900/50 rounded-lg p-2 text-center">
                    <div className="font-mono font-bold text-white text-sm">{v}</div>
                    <div className="label-text text-[10px]">{k}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail / Chart panel */}
        <div className="space-y-4">
          {sel ? (
            <>
              <div className="card">
                <h3 className="section-title mb-3">{sel.id} Details</h3>
                <div className="space-y-3 text-sm">
                  {[
                    ['Type', sel.type],
                    ['Location', sel.location],
                    ['City', sel.city],
                    ['Status', sel.status],
                    ['Last Ping', sel.lastPing],
                    ['Battery', `${sel.battery}%`],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="label-text">{k}</span>
                      <span className="text-white text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {sensorCharts[sel.id] && (
                <ChartCard title="Live Data Stream" subtitle="Last 60 minutes">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={sensorCharts[sel.id]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="t" tick={{ fill:'#94a3b8', fontSize:10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill:'#94a3b8', fontSize:10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background:'rgba(15,23,42,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:11 }} />
                      <Line type="monotone" dataKey="v" stroke="#0a6bff" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {sel.status !== 'online' && (
                <div className="card border border-alert-orange/20 bg-alert-orange/5">
                  <div className="flex items-start gap-2">
                    <MdWarning size={18} className="text-alert-orange flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-surface-200">
                      <div className="font-medium text-alert-orange mb-1">Attention Required</div>
                      This sensor is {sel.status}. Please dispatch a technician to inspect {sel.location}.
                    </div>
                  </div>
                  <button className="btn-primary text-xs mt-3 w-full">Dispatch Technician</button>
                </div>
              )}
            </>
          ) : (
            <div className="card flex flex-col items-center justify-center py-14 text-center">
              <MdSensors size={36} className="text-surface-300 mb-2" />
              <div className="text-surface-300 text-sm">Select a sensor to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
