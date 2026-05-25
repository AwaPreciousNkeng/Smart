import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAddAlert, MdMyLocation, MdUpload, MdCheckCircle } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function CommuterReportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ type: 'Accident', road: '', city: 'Douala', description: '', severity: 'medium' })
  const update = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  if (submitted) {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <MdCheckCircle size={64} className="text-alert-green mb-4" />
        </motion.div>
        <h2 className="font-display font-bold text-2xl text-white">Report Submitted!</h2>
        <p className="text-surface-300 text-sm mt-2 mb-6">Your incident report has been sent to traffic control. Thank you for helping keep roads safe.</p>
        <div className="flex gap-3">
          <Link to="/commuter" className="btn-ghost text-sm">Back to Home</Link>
          <button onClick={() => setSubmitted(false)} className="btn-primary text-sm">Report Another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="page-title">Report an Incident</h1>
        <p className="text-surface-300 text-sm mt-1">Help other commuters and traffic operators by reporting road incidents</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="label-text block mb-1.5">Incident Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['Accident','Breakdown','Flood','Road Work','Signal Fault','Other'].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, type: t}))}
                className={`py-2.5 px-2 rounded-xl text-xs font-medium text-center transition-all border ${form.type === t ? 'bg-primary-600/30 border-primary-500/30 text-primary-300' : 'bg-white/5 border-white/5 text-surface-300 hover:bg-white/10'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text block mb-1.5">Road / Location</label>
          <div className="relative">
            <MdMyLocation className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
            <input type="text" value={form.road} onChange={update('road')} placeholder="e.g. Carrefour Ndokotti" className="input-field pl-9" />
          </div>
        </div>

        <div>
          <label className="label-text block mb-1.5">City</label>
          <select value={form.city} onChange={update('city')} className="input-field">
            <option>Douala</option>
            <option>Yaoundé</option>
            <option>Bafoussam</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="label-text block mb-1.5">Severity</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 'low',      label: 'Low',      color: 'text-alert-green  border-alert-green/30  bg-alert-green/10' },
              { val: 'medium',   label: 'Medium',   color: 'text-alert-yellow border-alert-yellow/30 bg-alert-yellow/10' },
              { val: 'high',     label: 'High',     color: 'text-alert-orange border-alert-orange/30 bg-alert-orange/10' },
              { val: 'critical', label: 'Critical', color: 'text-alert-red    border-alert-red/30    bg-alert-red/10' },
            ].map(s => (
              <button key={s.val} onClick={() => setForm(f => ({...f, severity: s.val}))}
                className={`py-2 rounded-xl text-xs font-medium border transition-all ${form.severity === s.val ? s.color : 'bg-white/5 border-white/5 text-surface-300 hover:bg-white/10'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text block mb-1.5">Description</label>
          <textarea value={form.description} onChange={update('description')} rows={4} placeholder="Describe what happened, number of vehicles involved, road conditions…" className="input-field resize-none" />
        </div>

        <div>
          <label className="label-text block mb-1.5">Attach Photo (optional)</label>
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-primary-500/30 hover:bg-white/3 transition-all cursor-pointer text-surface-300 hover:text-white">
            <MdUpload size={24} />
            <span className="text-sm">Click to upload image</span>
            <span className="text-xs text-surface-300">PNG, JPG up to 10MB</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>

        <button onClick={() => setSubmitted(true)} className="btn-primary w-full flex items-center gap-2 justify-center">
          <MdAddAlert size={18} /> Submit Report
        </button>
      </div>
    </div>
  )
}
