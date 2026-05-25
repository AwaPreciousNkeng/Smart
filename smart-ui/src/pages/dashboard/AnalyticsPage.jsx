import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { MdDownload, MdTrendingUp, MdTrendingDown, MdBarChart } from 'react-icons/md'
import { hourlyTraffic, weeklyData, monthlyData } from '../../data/trafficData'
import { ChartCard } from '../../components/UIComponents'

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark rounded-xl p-3 text-xs border border-white/10">
      <div className="font-medium text-white mb-1">{label}</div>
      {payload.map(p => <div key={p.name} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span className="text-surface-300">{p.name}:</span><span className="text-white font-medium">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span></div>)}
    </div>
  )
}

const kpiData = [
  { label: 'Total Vehicles (Month)', value: '980,000', change: +8.2, color: 'text-alert-green' },
  { label: 'Avg Daily Incidents',    value: '187',     change: -5.8, color: 'text-alert-green' },
  { label: 'Peak Hour Avg Speed',    value: '20 km/h', change: -3.1, color: 'text-alert-red' },
  { label: 'Congestion Index',       value: '6.8/10',  change: +1.2, color: 'text-alert-orange' },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('weekly')

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="text-surface-300 text-sm mt-1">Traffic trends, congestion analysis and exportable reports</p>
        </div>
        <div className="flex gap-2">
          {['hourly','weekly','monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? 'bg-primary-600 text-white' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>{p}</button>
          ))}
          <button className="btn-ghost text-xs flex items-center gap-1.5">
            <MdDownload size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiData.map((k,i) => (
          <motion.div key={k.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }} className="card">
            <div className="label-text">{k.label}</div>
            <div className="value-text text-2xl mt-1">{k.value}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${k.color}`}>
              {k.change >= 0 ? <MdTrendingUp size={12} /> : <MdTrendingDown size={12} />}
              {Math.abs(k.change)}% vs last period
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Traffic Volume" subtitle={period === 'hourly' ? 'Today by hour' : period === 'weekly' ? 'This week' : 'Past 6 months'}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={period === 'hourly' ? hourlyTraffic : period === 'weekly' ? weeklyData : monthlyData}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0a6bff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0a6bff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey={period === 'hourly' ? 'time' : period === 'weekly' ? 'day' : 'month'} tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              {period === 'weekly' ? (
                <>
                  <Area type="monotone" dataKey="douala"  name="Douala"  stroke="#0a6bff" fill="url(#ga)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="yaounde" name="Yaoundé" stroke="#22c55e" fill="none"       strokeWidth={2} dot={false} />
                </>
              ) : (
                <Area type="monotone" dataKey={period === 'hourly' ? 'vehicles' : 'vehicles'} name="Vehicles" stroke="#0a6bff" fill="url(#ga)" strokeWidth={2} dot={false} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Incidents Trend" subtitle="Monthly incident count">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Bar dataKey="incidents" name="Incidents" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Speed Trend" subtitle="Monthly average corridor speed (km/h)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Line type="monotone" dataKey="avgSpeed" name="Avg Speed" stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Peak Hour Breakdown" subtitle="Incidents per hour today">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyTraffic.filter((_,i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill:'#94a3b8', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Bar dataKey="incidents" name="Incidents" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Report download section */}
      <div className="card">
        <h3 className="section-title mb-4">Download Reports</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: 'Daily Report',   sub: `${new Date().toLocaleDateString('en-GB')}`, size: '1.2 MB' },
            { title: 'Weekly Summary', sub: 'Week 23 – Jun 2025',                        size: '3.8 MB' },
            { title: 'Monthly Report', sub: 'May 2025',                                   size: '8.4 MB' },
          ].map(r => (
            <div key={r.title} className="flex items-center gap-3 p-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-primary-500/20 transition-all cursor-pointer group">
              <MdBarChart size={24} className="text-primary-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{r.title}</div>
                <div className="text-xs text-surface-300">{r.sub} · {r.size}</div>
              </div>
              <MdDownload size={16} className="text-surface-300 group-hover:text-primary-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
