import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdDirectionsBus, MdRoute, MdSchedule, MdMyLocation } from 'react-icons/md'
import { busRoutes, vehicles } from '../../data/trafficData'
import { StatusBadge, TrafficCard, SearchBar } from '../../components/UIComponents'

const buses = vehicles.filter(v => v.type === 'Bus')

const livePositions = [
  { id: 'B001', route: 'BR-01', driver: 'Nkuete H.', passengers: 32, eta: '3 min', status: 'on-time', speed: 42 },
  { id: 'B002', route: 'BR-01', driver: 'Bello F.',  passengers: 18, eta: '9 min', status: 'on-time', speed: 38 },
  { id: 'B003', route: 'BR-02', driver: 'Ekane C.',  passengers: 24, eta: '5 min', status: 'delayed', speed: 28 },
  { id: 'B004', route: 'BR-03', driver: 'Fopa M.',   passengers: 40, eta: '12 min',status: 'on-time', speed: 45 },
  { id: 'B005', route: 'BR-04', driver: 'Mbeki R.',  passengers: 15, eta: '7 min', status: 'on-time', speed: 50 },
  { id: 'B006', route: 'BR-06', driver: 'Tabi S.',   passengers: 8,  eta: 'N/A',   status: 'disrupted',speed: 0 },
]

export default function TransportPage() {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('all')

  const filteredRoutes = busRoutes.filter(r => {
    const matchCity = cityFilter === 'all' || r.city === cityFilter
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.from.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Public Transport Management</h1>
          <p className="text-surface-300 text-sm mt-1">Bus routes, fleet tracking and ETA monitoring</p>
        </div>
        <div className="flex gap-2">
          {['all','Douala','Yaoundé'].map(c => (
            <button key={c} onClick={() => setCityFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${cityFilter === c ? 'bg-primary-600 text-white' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
              {c === 'all' ? 'All Cities' : c}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Routes',   value: busRoutes.length,                          icon: MdRoute,        color: 'blue' },
          { label: 'Active Buses',   value: busRoutes.reduce((s,r) => s+r.active, 0), icon: MdDirectionsBus,color: 'green' },
          { label: 'Delayed Routes', value: busRoutes.filter(r => r.status === 'delayed' || r.status === 'disrupted').length, icon: MdSchedule, color: 'orange' },
          { label: 'Fleet Size',     value: busRoutes.reduce((s,r) => s+r.buses, 0),  icon: MdDirectionsBus,color: 'blue' },
        ].map((c,i) => <motion.div key={c.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}><TrafficCard {...c} /></motion.div>)}
      </div>

      {/* Search */}
      <div className="max-w-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search routes…" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Routes table */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="section-title">Bus Routes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  {['ID','Route','From → To','Stops','Buses','Status'].map(h => <th key={h} className="table-header">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map(r => (
                  <tr key={r.id} className="hover:bg-white/3 transition-colors">
                    <td className="table-cell font-mono text-xs text-primary-400">{r.id}</td>
                    <td className="table-cell font-medium text-white text-sm">{r.name}</td>
                    <td className="table-cell text-xs text-surface-300">{r.from} → {r.to}</td>
                    <td className="table-cell text-center text-white">{r.stops}</td>
                    <td className="table-cell text-center"><span className="font-mono font-bold text-white">{r.active}</span><span className="text-surface-300">/{r.buses}</span></td>
                    <td className="table-cell"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live bus tracker */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <h3 className="section-title">Live Bus Tracking</h3>
            <span className="badge-green text-[10px] ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-alert-green animate-ping inline-block" />
              Live
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {livePositions.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-4 hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center">
                  <MdDirectionsBus size={18} className="text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{b.id}</span>
                    <span className="font-mono text-xs text-primary-400">{b.route}</span>
                  </div>
                  <div className="text-xs text-surface-300">Driver: {b.driver} · {b.passengers} passengers</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <MdSchedule size={12} className="text-surface-300" />
                    <span className={`text-xs font-medium ${b.eta === 'N/A' ? 'text-alert-red' : 'text-white'}`}>ETA {b.eta}</span>
                  </div>
                  <div className="mt-1"><StatusBadge status={b.status} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="section-title">Fleet Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr>{['Plate','Make/Model','Year','Operator','City','Status'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody>
              {buses.map(v => (
                <tr key={v.id} className="hover:bg-white/3 transition-colors">
                  <td className="table-cell font-mono text-sm text-primary-300">{v.plate}</td>
                  <td className="table-cell text-white">{v.make} {v.model}</td>
                  <td className="table-cell text-surface-300">{v.year}</td>
                  <td className="table-cell text-sm text-surface-200">{v.owner}</td>
                  <td className="table-cell text-xs text-surface-300">{v.city}</td>
                  <td className="table-cell"><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
