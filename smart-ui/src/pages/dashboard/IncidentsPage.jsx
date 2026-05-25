import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdFilterList, MdRefresh, MdCheckCircle, MdVisibility, MdUpload } from 'react-icons/md'
import { incidents as dummyIncidents } from '../../data/trafficData'
import { SeverityBadge, StatusBadge, SearchBar, Modal } from '../../components/UIComponents'

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(dummyIncidents)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const filtered = incidents.filter(i => {
    const matchSearch = i.type.toLowerCase().includes(search.toLowerCase()) ||
                        i.road.toLowerCase().includes(search.toLowerCase()) ||
                        i.city.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || i.severity === filter || i.status.toLowerCase() === filter
    return matchSearch && matchFilter
  })

  const resolve = (id) => setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved' } : i))
  const acknowledge = (id) => setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Monitoring' } : i))

  const severityCount = (s) => incidents.filter(i => i.severity === s).length

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Incident Management</h1>
          <p className="text-surface-300 text-sm mt-1">Track, manage and resolve traffic incidents</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} /> Report Incident
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: incidents.length,                color: 'border-primary-500/30' },
          { label: 'Critical', value: severityCount('critical'),       color: 'border-alert-red/30' },
          { label: 'High',     value: severityCount('high'),           color: 'border-alert-orange/30' },
          { label: 'Resolved', value: incidents.filter(i => i.status === 'Resolved').length, color: 'border-alert-green/30' },
        ].map(s => (
          <div key={s.label} className={`card border ${s.color} text-center`}>
            <div className="value-text text-2xl">{s.value}</div>
            <div className="label-text mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 max-w-xs">
          <SearchBar value={search} onChange={setSearch} placeholder="Search incidents…" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'critical', 'high', 'medium', 'low', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  {['ID','Type','Road','City','Severity','Status','Time','Actions'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inc => (
                  <motion.tr
                    key={inc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/3 transition-colors cursor-pointer"
                    onClick={() => setSelected(inc)}
                  >
                    <td className="table-cell font-mono text-xs text-primary-400">{inc.id}</td>
                    <td className="table-cell font-medium text-white">{inc.type}</td>
                    <td className="table-cell text-xs text-surface-300 max-w-[140px] truncate">{inc.road}</td>
                    <td className="table-cell text-xs">{inc.city}</td>
                    <td className="table-cell"><SeverityBadge severity={inc.severity} /></td>
                    <td className="table-cell"><StatusBadge status={inc.status} /></td>
                    <td className="table-cell text-xs text-surface-300">{inc.time}</td>
                    <td className="table-cell">
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        {inc.status !== 'Resolved' && (
                          <button onClick={() => resolve(inc.id)} className="p-1.5 rounded-lg bg-alert-green/10 text-alert-green hover:bg-alert-green/20 transition-all" title="Resolve">
                            <MdCheckCircle size={14} />
                          </button>
                        )}
                        <button onClick={() => setSelected(inc)} className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all" title="View">
                          <MdVisibility size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="table-cell text-center text-surface-300 py-10">No incidents found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="card">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">{selected.id}</h3>
                <SeverityBadge severity={selected.severity} />
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ['Type',        selected.type],
                  ['Road',        selected.road],
                  ['City',        selected.city],
                  ['Status',      selected.status],
                  ['Reported by', selected.reportedBy],
                  ['Date/Time',   `${selected.date} ${selected.time}`],
                ].map(([k,v]) => (
                  <div key={k}>
                    <div className="label-text">{k}</div>
                    <div className="text-white mt-0.5">{v}</div>
                  </div>
                ))}
                <div>
                  <div className="label-text">Description</div>
                  <p className="text-surface-200 text-xs mt-0.5 leading-relaxed">{selected.description}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                {selected.status !== 'Resolved' && (
                  <button onClick={() => { resolve(selected.id); setSelected({ ...selected, status: 'Resolved' }) }} className="btn-primary text-xs flex items-center gap-1.5 flex-1 justify-center">
                    <MdCheckCircle size={14} /> Resolve
                  </button>
                )}
                <button className="btn-ghost text-xs flex items-center gap-1.5 flex-1 justify-center">
                  <MdUpload size={14} /> Evidence
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <MdVisibility size={36} className="text-surface-300 mb-2" />
              <div className="text-surface-300 text-sm">Select an incident to view details</div>
            </div>
          )}
        </div>
      </div>

      {/* Report Incident Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Report New Incident">
        <div className="space-y-4">
          {[
            { label: 'Incident Type', type: 'select', options: ['Accident','Breakdown','Flood','Road Work','Signal Fault','Protest','Other'] },
            { label: 'Road / Location', type: 'text' },
            { label: 'City', type: 'select', options: ['Douala','Yaoundé','Bafoussam','Other'] },
            { label: 'Severity', type: 'select', options: ['low','medium','high','critical'] },
            { label: 'Description', type: 'textarea' },
          ].map(f => (
            <div key={f.label}>
              <label className="label-text block mb-1.5">{f.label}</label>
              {f.type === 'select' ? (
                <select className="input-field">
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea className="input-field resize-none" rows={3} />
              ) : (
                <input type="text" className="input-field" />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={() => setAddOpen(false)} className="btn-primary flex-1">Submit Incident</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
