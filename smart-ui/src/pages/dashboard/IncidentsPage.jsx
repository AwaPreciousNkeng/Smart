import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdVisibility, MdUpdate, MdMyLocation } from 'react-icons/md'
import { SearchBar, Modal } from '../../components/UIComponents'
import { incidentsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const INCIDENT_TYPES = ['ROAD_ACCIDENT','VEHICLE_BREAKDOWN','ROAD_HAZARD','FLOODING','ROAD_WORKS','FIRE','OTHER']
const SEVERITIES     = ['LOW','MEDIUM','HIGH','CRITICAL']
const STATUSES       = ['OPEN','ACKNOWLEDGED','IN_RESPONSE','RESOLVED','CLOSED','CANCELLED']

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}
const severityBadge  = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-orange', CRITICAL:'badge-red' }
const statusBadge    = {
  OPEN:'badge-red', ACKNOWLEDGED:'badge-yellow', IN_RESPONSE:'badge-orange',
  RESOLVED:'badge-green', CLOSED:'badge-blue', CANCELLED:'badge-gray',
}

const EMPTY_REPORT = { lat: '', lon: '', type: 'ROAD_ACCIDENT', severity: 'MEDIUM', description: '' }
const EMPTY_UPDATE = { status: 'ACKNOWLEDGED', closingNote: '' }

export default function IncidentsPage() {
  const { user } = useAuth()
  const isOperator = user?.role === 'Transport Operator'
  const isCommuter = user?.role === 'Commuter'

  const [incidents,   setIncidents]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [sevFilter,   setSevFilter]   = useState('all')
  const [selected,    setSelected]    = useState(null)
  const [reportOpen,  setReportOpen]  = useState(false)
  const [updateOpen,  setUpdateOpen]  = useState(false)
  const [updateTarget,setUpdateTarget]= useState(null)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [report,      setReport]      = useState(EMPTY_REPORT)
  const [upd,         setUpd]         = useState(EMPTY_UPDATE)
  const [locating,    setLocating]    = useState(false)

  const fetchIncidents = () => {
    const req = isCommuter ? incidentsAPI.getMyReported() : incidentsAPI.getAll()
    req
      .then(r => setIncidents(r.data))
      .catch(() => setError('Failed to load incidents'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchIncidents() }, [])

  const filtered = incidents.filter(i => {
    const q = search.toLowerCase()
    const matchSearch =
      typeLabel[i.type]?.toLowerCase().includes(q) ||
      i.locationName?.toLowerCase().includes(q) ||
      i.reportedBy?.toLowerCase().includes(q)
    const matchSev = sevFilter === 'all' || i.severity === sevFilter
    return matchSearch && matchSev
  })

  const getLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setReport(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) }))
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const handleReport = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const requestBlob = new Blob(
        [JSON.stringify({ lat: parseFloat(report.lat), lon: parseFloat(report.lon), type: report.type, severity: report.severity, description: report.description })],
        { type: 'application/json' }
      )
      const fd = new FormData()
      fd.append('request', requestBlob)
      await incidentsAPI.create(fd)
      fetchIncidents()
      setReportOpen(false)
      setReport(EMPTY_REPORT)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report incident')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await incidentsAPI.update({
        incidentId: updateTarget.id,
        status:     upd.status,
        closingNote:upd.closingNote,
        officerId:  user.id,
      })
      fetchIncidents()
      setUpdateOpen(false)
      setUpdateTarget(null)
      setSelected(null)
      setUpd(EMPTY_UPDATE)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident')
    } finally {
      setSaving(false)
    }
  }

  const openUpdate = (inc, e) => {
    e?.stopPropagation()
    setUpdateTarget(inc)
    setUpd(EMPTY_UPDATE)
    setError('')
    setUpdateOpen(true)
  }

  const updReport = k => e => setReport(f => ({ ...f, [k]: e.target.value }))
  const updUpd    = k => e => setUpd(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Incident Management</h1>
          <p className="text-surface-300 text-sm mt-1">
            {isCommuter ? 'Your reported incidents' : 'Track, manage and resolve traffic incidents'}
          </p>
        </div>
        <button onClick={() => { setReportOpen(true); setError('') }} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} /> Report Incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: incidents.length,                                      color: '' },
          { label: 'Critical', value: incidents.filter(i => i.severity === 'CRITICAL').length, color: 'border-red-500/30' },
          { label: 'High',     value: incidents.filter(i => i.severity === 'HIGH').length,     color: 'border-orange-500/30' },
          { label: 'Resolved', value: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length, color: 'border-green-500/30' },
        ].map(s => (
          <div key={s.label} className={`card text-center py-3 ${s.color ? `border ${s.color}` : ''}`}>
            <div className="value-text text-2xl">{s.value}</div>
            <div className="text-xs text-surface-300 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 max-w-xs">
          <SearchBar value={search} onChange={setSearch} placeholder="Search type, location, reporter…" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSevFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sevFilter === 'all' ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
            All
          </button>
          {SEVERITIES.map(s => (
            <button key={s} onClick={() => setSevFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${sevFilter === s ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-surface-300 text-sm">Loading incidents…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/5">
                  <tr>
                    {['#','Type','Location','Severity','Status','Reported By','Date','Actions'].map(h => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inc, i) => (
                    <motion.tr key={inc.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setSelected(inc)}>
                      <td className="table-cell text-surface-300 text-xs">{i + 1}</td>
                      <td className="table-cell font-medium text-white text-sm">{typeLabel[inc.type] || inc.type}</td>
                      <td className="table-cell text-xs text-surface-300 max-w-[130px] truncate">{inc.locationName || `${inc.lat?.toFixed(3)}, ${inc.lon?.toFixed(3)}`}</td>
                      <td className="table-cell">
                        <span className={severityBadge[inc.severity] || 'badge-blue'}>{inc.severity}</span>
                      </td>
                      <td className="table-cell">
                        <span className={statusBadge[inc.status] || 'badge-blue'}>{inc.status}</span>
                      </td>
                      <td className="table-cell text-xs text-surface-300">{inc.reportedBy || '—'}</td>
                      <td className="table-cell text-xs text-surface-300">
                        {inc.reportedAt ? new Date(inc.reportedAt).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="table-cell" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button onClick={() => setSelected(inc)}
                            className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all" title="View">
                            <MdVisibility size={14} />
                          </button>
                          {isOperator && inc.status !== 'CLOSED' && inc.status !== 'CANCELLED' && (
                            <button onClick={e => openUpdate(inc, e)}
                              className="p-1.5 rounded-lg bg-alert-orange/10 text-alert-orange hover:bg-alert-orange/20 transition-all" title="Update Status">
                              <MdUpdate size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <tr><td colSpan={8} className="table-cell text-center text-surface-300 py-10">No incidents found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="card">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="section-title truncate">{typeLabel[selected.type] || selected.type}</h3>
                <span className={severityBadge[selected.severity] || 'badge-blue'}>{selected.severity}</span>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ['Status',      <span className={statusBadge[selected.status] || 'badge-blue'}>{selected.status}</span>],
                  ['Location',    selected.locationName || `${selected.lat?.toFixed(4)}, ${selected.lon?.toFixed(4)}`],
                  ['Reported by', selected.reportedBy || '—'],
                  ['Assigned to', selected.assignedTo || '—'],
                  ['Reported at', selected.reportedAt ? new Date(selected.reportedAt).toLocaleString('en-GB') : '—'],
                  ['Resolved at', selected.resolvedAt ? new Date(selected.resolvedAt).toLocaleString('en-GB') : '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="label-text">{k}</div>
                    <div className="text-white mt-0.5">{v}</div>
                  </div>
                ))}
                {selected.description && (
                  <div>
                    <div className="label-text">Description</div>
                    <p className="text-surface-200 text-xs mt-0.5 leading-relaxed">{selected.description}</p>
                  </div>
                )}
                {selected.closingNote && (
                  <div>
                    <div className="label-text">Closing Note</div>
                    <p className="text-surface-200 text-xs mt-0.5 leading-relaxed">{selected.closingNote}</p>
                  </div>
                )}
              </div>
              {isOperator && selected.status !== 'CLOSED' && selected.status !== 'CANCELLED' && (
                <button onClick={e => openUpdate(selected, e)}
                  className="btn-primary text-xs flex items-center gap-1.5 w-full justify-center mt-2">
                  <MdUpdate size={14} /> Update Status
                </button>
              )}
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
      <Modal open={reportOpen} onClose={() => { setReportOpen(false); setError(''); setReport(EMPTY_REPORT) }} title="Report New Incident">
        <form onSubmit={handleReport} className="space-y-4">
          {error && <div className="text-xs text-alert-red bg-alert-red/10 rounded-lg px-3 py-2">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-1.5">Latitude</label>
              <input type="number" step="any" value={report.lat} onChange={updReport('lat')} required
                className="input-field" placeholder="3.8480" />
            </div>
            <div>
              <label className="label-text block mb-1.5">Longitude</label>
              <input type="number" step="any" value={report.lon} onChange={updReport('lon')} required
                className="input-field" placeholder="11.5021" />
            </div>
          </div>
          <button type="button" onClick={getLocation} disabled={locating}
            className="btn-ghost text-xs flex items-center gap-1.5 w-full justify-center">
            <MdMyLocation size={14} /> {locating ? 'Locating…' : 'Use My Current Location'}
          </button>
          <div>
            <label className="label-text block mb-1.5">Incident Type</label>
            <select value={report.type} onChange={updReport('type')} className="input-field">
              {INCIDENT_TYPES.map(t => <option key={t} value={t}>{typeLabel[t]}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text block mb-1.5">Severity</label>
            <select value={report.severity} onChange={updReport('severity')} className="input-field">
              {SEVERITIES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text block mb-1.5">Description</label>
            <textarea value={report.description} onChange={updReport('description')}
              className="input-field resize-none" rows={3} placeholder="Describe the incident…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setReportOpen(false); setError(''); setReport(EMPTY_REPORT) }} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Status Modal (Transport Operator only) */}
      <Modal open={updateOpen} onClose={() => { setUpdateOpen(false); setError('') }} title="Update Incident Status">
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && <div className="text-xs text-alert-red bg-alert-red/10 rounded-lg px-3 py-2">{error}</div>}
          {updateTarget && (
            <div className="text-xs text-surface-300 bg-white/5 rounded-lg px-3 py-2">
              Incident: <span className="text-white font-medium">{typeLabel[updateTarget.type]}</span> — {updateTarget.locationName || `${updateTarget.lat?.toFixed(4)}, ${updateTarget.lon?.toFixed(4)}`}
            </div>
          )}
          <div>
            <label className="label-text block mb-1.5">New Status</label>
            <select value={upd.status} onChange={updUpd('status')} className="input-field">
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text block mb-1.5">Closing Note</label>
            <textarea value={upd.closingNote} onChange={updUpd('closingNote')} required
              className="input-field resize-none" rows={3} placeholder="Describe the action taken…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setUpdateOpen(false); setError('') }} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Updating…' : 'Update Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}