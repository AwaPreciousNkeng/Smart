import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdDirectionsCar, MdSearch, MdEdit, MdDelete, MdVerified } from 'react-icons/md'
import { vehicles } from '../../data/trafficData'
import { StatusBadge, SearchBar, Modal } from '../../components/UIComponents'

const typeIcon = { Taxi: '🚕', Bus: '🚌', Truck: '🚚', Moto: '🏍️', Car: '🚗' }

export default function VehiclesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)

  const filtered = vehicles.filter(v => {
    const matchSearch =
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.owner.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || v.type === typeFilter
    return matchSearch && matchType
  })

  const types = ['all', ...new Set(vehicles.map(v => v.type))]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Vehicle & Driver Registry</h1>
          <p className="text-surface-300 text-sm mt-1">Registered vehicles, owner profiles and license verification</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} /> Register Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total',     value: vehicles.length },
          { label: 'Taxis',     value: vehicles.filter(v => v.type === 'Taxi').length },
          { label: 'Buses',     value: vehicles.filter(v => v.type === 'Bus').length },
          { label: 'Trucks',    value: vehicles.filter(v => v.type === 'Truck').length },
          { label: 'Suspended', value: vehicles.filter(v => v.status === 'suspended' || v.status === 'impounded').length },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="value-text text-2xl">{s.value}</div>
            <div className="label-text mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 max-w-xs">
          <SearchBar value={search} onChange={setSearch} placeholder="Search plate, owner, make…" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${typeFilter === t ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
              {typeIcon[t] && `${typeIcon[t]} `}{t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr>
                {['#', 'Plate', 'Type', 'Make / Model', 'Year', 'Owner', 'License No.', 'City', 'Color', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/3 transition-colors">
                  <td className="table-cell text-surface-300 text-xs">{i + 1}</td>
                  <td className="table-cell">
                    <span className="font-mono font-bold text-primary-300 text-sm bg-primary-500/10 px-2 py-0.5 rounded">{v.plate}</span>
                  </td>
                  <td className="table-cell text-sm">{typeIcon[v.type]} {v.type}</td>
                  <td className="table-cell text-white font-medium">{v.make} {v.model}</td>
                  <td className="table-cell text-surface-300">{v.year}</td>
                  <td className="table-cell text-sm">{v.owner}</td>
                  <td className="table-cell font-mono text-xs text-surface-300">{v.license}</td>
                  <td className="table-cell text-xs text-surface-300">{v.city}</td>
                  <td className="table-cell text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: v.color.toLowerCase() === 'yellow' ? '#f59e0b' : v.color.toLowerCase() === 'white' ? '#f1f5f9' : v.color.toLowerCase() === 'blue' ? '#3b82f6' : v.color.toLowerCase() === 'red' ? '#ef4444' : v.color.toLowerCase() === 'black' ? '#1e293b' : v.color.toLowerCase() === 'orange' ? '#f97316' : '#94a3b8' }} />
                      {v.color}
                    </span>
                  </td>
                  <td className="table-cell"><StatusBadge status={v.status} /></td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all" title="Verify">
                        <MdVerified size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg bg-white/5 text-surface-300 hover:bg-white/10 transition-all" title="Edit">
                        <MdEdit size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg bg-alert-red/10 text-alert-red hover:bg-alert-red/20 transition-all" title="Delete">
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="table-cell text-center text-surface-300 py-10">No vehicles found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register New Vehicle" wide>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Plate Number',    type: 'text',   ph: 'CE 0000 X' },
            { label: 'Vehicle Type',    type: 'select', opts: ['Taxi','Bus','Truck','Moto','Car','Van'] },
            { label: 'Make',            type: 'text',   ph: 'Toyota' },
            { label: 'Model',           type: 'text',   ph: 'Corolla' },
            { label: 'Year',            type: 'number', ph: '2022' },
            { label: 'Color',           type: 'text',   ph: 'White' },
            { label: 'Owner Full Name', type: 'text',   ph: 'Jean Dupont' },
            { label: 'License Number',  type: 'text',   ph: 'DLA-TXI-00000' },
            { label: 'City',            type: 'select', opts: ['Douala','Yaoundé','Bafoussam','Garoua','Maroua'] },
            { label: 'Phone',           type: 'tel',    ph: '+237 677 000 000' },
          ].map(f => (
            <div key={f.label}>
              <label className="label-text block mb-1.5">{f.label}</label>
              {f.type === 'select'
                ? <select className="input-field">{f.opts.map(o => <option key={o}>{o}</option>)}</select>
                : <input type={f.type} placeholder={f.ph} className="input-field" />}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setAddOpen(false)} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => setAddOpen(false)} className="btn-primary flex-1">Register Vehicle</button>
        </div>
      </Modal>
    </div>
  )
}
