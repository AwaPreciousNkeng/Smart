import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdDirectionsCar } from 'react-icons/md'
import { SearchBar, Modal } from '../../components/UIComponents'
import { vehiclesAPI } from '../../services/api'

const CATEGORIES = ['TAXI', 'BUS', 'MINI_BUS', 'EMERGENCY', 'MOTORCYCLE', 'PRIVATE']

const categoryLabel = {
  TAXI: 'Taxi', BUS: 'Bus', MINI_BUS: 'Mini Bus',
  EMERGENCY: 'Emergency', MOTORCYCLE: 'Motorcycle', PRIVATE: 'Private',
}

const categoryIcon = {
  TAXI: '🚕', BUS: '🚌', MINI_BUS: '🚐', EMERGENCY: '🚨', MOTORCYCLE: '🏍️', PRIVATE: '🚗',
}

const statusBadge = {
  IDLE:           'badge-green',
  EN_ROUTE:       'badge-blue',
  OUT_OF_SERVICE: 'badge-red',
}

const statusLabel = {
  IDLE: 'Idle', EN_ROUTE: 'En Route', OUT_OF_SERVICE: 'Out of Service',
}

const EMPTY_FORM = { plateNumber: '', make: '', model: '', vehicleCategory: 'TAXI' }

export default function VehiclesPage() {
  const [vehicles,    setVehicles]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [catFilter,   setCatFilter]   = useState('all')
  const [addOpen,     setAddOpen]     = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [form,        setForm]        = useState(EMPTY_FORM)

  useEffect(() => {
    vehiclesAPI.getAll()
      .then(r => setVehicles(r.data))
      .catch(() => setError('Failed to load vehicles'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase()
    const matchSearch =
      v.plateNumber?.toLowerCase().includes(q) ||
      v.ownerName?.toLowerCase().includes(q) ||
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q)
    const matchCat = catFilter === 'all' || v.category === catFilter
    return matchSearch && matchCat
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await vehiclesAPI.create(form)
      const updated = await vehiclesAPI.getAll()
      setVehicles(updated.data)
      setAddOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register vehicle')
    } finally {
      setSaving(false)
    }
  }

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const statCounts = CATEGORIES.reduce((acc, c) => {
    acc[c] = vehicles.filter(v => v.category === c).length
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Vehicle Registry</h1>
          <p className="text-surface-300 text-sm mt-1">Registered vehicles and their current status</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} /> Register Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card text-center py-3">
          <div className="value-text text-2xl">{vehicles.length}</div>
          <div className="text-xs text-surface-300 mt-1">Total</div>
        </div>
        <div className="card text-center py-3">
          <div className="value-text text-2xl">{vehicles.filter(v => v.status === 'IDLE').length}</div>
          <div className="text-xs text-surface-300 mt-1">Idle</div>
        </div>
        <div className="card text-center py-3">
          <div className="value-text text-2xl">{vehicles.filter(v => v.status === 'EN_ROUTE').length}</div>
          <div className="text-xs text-surface-300 mt-1">En Route</div>
        </div>
        <div className="card text-center py-3">
          <div className="value-text text-2xl">{vehicles.filter(v => v.status === 'OUT_OF_SERVICE').length}</div>
          <div className="text-xs text-surface-300 mt-1">Out of Service</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 max-w-xs">
          <SearchBar value={search} onChange={setSearch} placeholder="Search plate, owner, make…" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCatFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${catFilter === 'all' ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
            All
          </button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${catFilter === c ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
              {categoryIcon[c]} {categoryLabel[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-surface-300 text-sm">Loading vehicles…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  {['#', 'Plate', 'Category', 'Make / Model', 'Owner', 'Status', 'Last Position', 'Updated'].map(h => (
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
                      <span className="font-mono font-bold text-primary-300 text-sm bg-primary-500/10 px-2 py-0.5 rounded">
                        {v.plateNumber}
                      </span>
                    </td>
                    <td className="table-cell text-sm">
                      {categoryIcon[v.category]} {categoryLabel[v.category] || v.category}
                    </td>
                    <td className="table-cell text-white font-medium text-sm">{v.make} {v.model}</td>
                    <td className="table-cell text-sm text-surface-300">{v.ownerName || '—'}</td>
                    <td className="table-cell">
                      <span className={statusBadge[v.status] || 'badge-blue'}>
                        {statusLabel[v.status] || v.status}
                      </span>
                    </td>
                    <td className="table-cell text-xs text-surface-300 font-mono">
                      {v.lat != null ? `${v.lat.toFixed(4)}, ${v.lon.toFixed(4)}` : '—'}
                    </td>
                    <td className="table-cell text-xs text-surface-300">
                      {v.positionUpdatedAt ? new Date(v.positionUpdatedAt).toLocaleString('en-GB') : '—'}
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="table-cell text-center text-surface-300 py-10">No vehicles found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Vehicle Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setError(''); setForm(EMPTY_FORM) }} title="Register New Vehicle">
        <form onSubmit={handleAdd} className="space-y-4">
          {error && <div className="text-xs text-alert-red bg-alert-red/10 rounded-lg px-3 py-2">{error}</div>}
          <div>
            <label className="label-text block mb-1.5">Plate Number</label>
            <input type="text" value={form.plateNumber} onChange={upd('plateNumber')} required
              className="input-field" placeholder="CE 0000 X" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-1.5">Make</label>
              <input type="text" value={form.make} onChange={upd('make')} required
                className="input-field" placeholder="Toyota" />
            </div>
            <div>
              <label className="label-text block mb-1.5">Model</label>
              <input type="text" value={form.model} onChange={upd('model')} required
                className="input-field" placeholder="Corolla" />
            </div>
          </div>
          <div>
            <label className="label-text block mb-1.5">Category</label>
            <select value={form.vehicleCategory} onChange={upd('vehicleCategory')} className="input-field">
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{categoryIcon[c]} {categoryLabel[c]}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setAddOpen(false); setError(''); setForm(EMPTY_FORM) }} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Registering…' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}