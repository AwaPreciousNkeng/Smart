import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdMyLocation, MdCheckCircle, MdArrowBack } from 'react-icons/md'
import { incidentsAPI } from '../../services/api'

const INCIDENT_TYPES = ['ROAD_ACCIDENT','VEHICLE_BREAKDOWN','ROAD_HAZARD','FLOODING','ROAD_WORKS','FIRE','OTHER']
const SEVERITIES     = ['LOW','MEDIUM','HIGH','CRITICAL']

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Vehicle Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}

const EMPTY = { lat:'', lon:'', type:'ROAD_ACCIDENT', severity:'MEDIUM', description:'' }

export default function CommuterReportPage() {
  const navigate = useNavigate()
  const [form,     setForm]     = useState(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [done,     setDone]     = useState(false)
  const [error,    setError]    = useState('')
  const [locating, setLocating] = useState(false)

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const getLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported by this browser.'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) }))
        setLocating(false)
      },
      () => { setError('Could not get your location. Enter coordinates manually.'); setLocating(false) }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const requestBlob = new Blob(
        [JSON.stringify({ lat: parseFloat(form.lat), lon: parseFloat(form.lon), type: form.type, severity: form.severity, description: form.description })],
        { type: 'application/json' }
      )
      const fd = new FormData()
      fd.append('request', requestBlob)
      await incidentsAPI.create(fd)
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200 }}
          className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <MdCheckCircle size={36} color="#16a34a" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-white font-bold text-lg mb-1">Report Submitted</h2>
          <p className="text-surface-300 text-sm">Thank you! Your incident report has been received.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setDone(false); setForm(EMPTY) }} className="btn-ghost text-sm">Report Another</button>
          <button onClick={() => navigate('/commuter')} className="btn-primary text-sm">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/commuter')} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
          <MdArrowBack size={16} className="text-surface-300" />
        </button>
        <div>
          <h1 className="page-title">Report an Incident</h1>
          <p className="text-surface-300 text-sm mt-0.5">Help other commuters by reporting traffic incidents</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && <div className="text-xs text-alert-red bg-alert-red/10 rounded-lg px-3 py-2">{error}</div>}

        {/* Location */}
        <div>
          <label className="label-text block mb-2">Your Location</label>
          <button type="button" onClick={getLocation} disabled={locating}
            className="btn-ghost text-sm flex items-center gap-2 mb-3 w-full justify-center">
            <MdMyLocation size={16} /> {locating ? 'Getting location…' : 'Use My Current Location'}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text block mb-1">Latitude</label>
              <input type="number" step="any" value={form.lat} onChange={upd('lat')} required
                className="input-field" placeholder="3.8480" />
            </div>
            <div>
              <label className="label-text block mb-1">Longitude</label>
              <input type="number" step="any" value={form.lon} onChange={upd('lon')} required
                className="input-field" placeholder="11.5021" />
            </div>
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="label-text block mb-1.5">Incident Type</label>
          <select value={form.type} onChange={upd('type')} className="input-field">
            {INCIDENT_TYPES.map(t => <option key={t} value={t}>{typeLabel[t]}</option>)}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="label-text block mb-1.5">How serious is it?</label>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITIES.map(s => (
              <button key={s} type="button" onClick={() => setForm(f => ({ ...f, severity: s }))}
                className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                  form.severity === s
                    ? s === 'LOW' ? 'bg-green-500/20 border-green-500/40 text-green-400'
                    : s === 'MEDIUM' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                    : s === 'HIGH' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                    : 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-white/5 border-white/10 text-surface-300 hover:bg-white/10'
                }`}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label-text block mb-1.5">Description</label>
          <textarea value={form.description} onChange={upd('description')}
            className="input-field resize-none" rows={4}
            placeholder="Describe what you see — number of vehicles involved, road conditions, whether emergency services are needed…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/commuter')} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Submitting…' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  )
}