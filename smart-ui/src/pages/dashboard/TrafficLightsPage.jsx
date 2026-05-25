import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdTripOrigin, MdFlashOn, MdWarning, MdSettings, MdRefresh } from 'react-icons/md'
import { trafficLights as dummyLights } from '../../data/trafficData'

const PhaseIndicator = ({ phase }) => {
  const phases = [
    { id: 'red',    color: 'bg-alert-red',    glow: 'shadow-[0_0_12px_#ef4444]' },
    { id: 'yellow', color: 'bg-alert-yellow', glow: 'shadow-[0_0_12px_#f59e0b]' },
    { id: 'green',  color: 'bg-alert-green',  glow: 'shadow-[0_0_12px_#22c55e]' },
  ]
  return (
    <div className="flex flex-col items-center gap-1.5 bg-surface-900/80 rounded-xl p-2 border border-white/5 w-10">
      {phases.map(p => (
        <div key={p.id} className={`w-6 h-6 rounded-full transition-all duration-500 ${phase === p.id ? `${p.color} ${p.glow}` : 'bg-surface-700'}`} />
      ))}
    </div>
  )
}

export default function TrafficLightsPage() {
  const [lights, setLights] = useState(dummyLights)
  const [selected, setSelected] = useState(null)

  const setMode = (id, mode) => {
    setLights(prev => prev.map(l => l.id === id ? { ...l, mode, status: mode === 'emergency' ? 'emergency' : mode === 'manual' ? 'manual' : 'auto' } : l))
  }

  const setPhase = (id, phase) => {
    setLights(prev => prev.map(l => l.id === id ? { ...l, phase } : l))
  }

  const modeColor = { auto: 'badge-green', manual: 'badge-yellow', emergency: 'badge-red', fault: 'badge-orange' }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Traffic Light Control</h1>
        <p className="text-surface-300 text-sm mt-1">Monitor and override smart traffic signals</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Signals',  value: lights.length, color: 'border-primary-500/30' },
          { label: 'Auto Mode',      value: lights.filter(l => l.mode === 'adaptive').length, color: 'border-alert-green/30' },
          { label: 'Manual/Override',value: lights.filter(l => l.mode === 'manual').length,   color: 'border-alert-yellow/30' },
          { label: 'Fault/Emergency',value: lights.filter(l => l.mode === 'fault' || l.mode === 'emergency').length, color: 'border-alert-red/30' },
        ].map(s => (
          <div key={s.label} className={`card border text-center ${s.color}`}>
            <div className="value-text text-2xl">{s.value}</div>
            <div className="label-text mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lights grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lights.map((tl, i) => (
          <motion.div
            key={tl.id}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
            onClick={() => setSelected(tl.id === selected ? null : tl.id)}
            className={`card-hover border transition-all ${selected === tl.id ? 'border-primary-500/50 bg-white/10' : 'border-white/5'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display font-semibold text-white text-sm">{tl.id}</div>
                <div className="text-xs text-surface-300 mt-0.5">{tl.location}</div>
                <div className="text-xs text-surface-300">{tl.city}</div>
              </div>
              <PhaseIndicator phase={tl.mode === 'fault' ? 'off' : tl.phase} />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={modeColor[tl.mode] || 'badge-blue'}>{tl.mode}</span>
              {tl.cycleTime > 0 && <span className="text-xs text-surface-300 font-mono">{tl.cycleTime}s cycle</span>}
            </div>

            {/* Controls (visible when selected) */}
            {selected === tl.id && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="space-y-3 pt-3 border-t border-white/5">
                <div>
                  <div className="label-text mb-2">Phase Control</div>
                  <div className="flex gap-2">
                    {['red','yellow','green'].map(p => (
                      <button key={p} onClick={e => { e.stopPropagation(); setPhase(tl.id, p) }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${tl.phase === p ? `bg-${p === 'red' ? 'alert-red' : p === 'yellow' ? 'alert-yellow' : 'alert-green'}/20 border-current` : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        style={{ color: p === 'red' ? '#ef4444' : p === 'yellow' ? '#f59e0b' : '#22c55e' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="label-text mb-2">Mode Override</div>
                  <div className="flex gap-2 flex-wrap">
                    {['adaptive','manual','emergency'].map(m => (
                      <button key={m} onClick={e => { e.stopPropagation(); setMode(tl.id, m) }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${tl.mode === m ? 'bg-primary-600 text-white' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
                        {m === 'emergency' && '🚨 '}{m}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tl.mode === 'fault' && (
              <div className="flex items-center gap-1.5 text-xs text-alert-orange mt-2">
                <MdWarning size={13} /> Signal fault — manual intervention required
              </div>
            )}
            {tl.mode === 'emergency' && (
              <div className="flex items-center gap-1.5 text-xs text-alert-red mt-2 animate-pulse">
                <MdFlashOn size={13} /> Emergency mode active
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Emergency broadcast */}
      <div className="card border border-alert-red/20">
        <div className="flex items-center gap-3 mb-3">
          <MdFlashOn size={20} className="text-alert-red" />
          <h3 className="section-title">Emergency Mode Broadcast</h3>
        </div>
        <p className="text-sm text-surface-300 mb-4">Activate emergency mode on all traffic signals simultaneously. This will set all signals to flash red and clear corridors for emergency vehicles.</p>
        <div className="flex gap-3">
          <select className="input-field flex-1 max-w-xs">
            <option>All Signals</option>
            <option>Douala Only</option>
            <option>Yaoundé Only</option>
          </select>
          <button
            onClick={() => setLights(prev => prev.map(l => ({ ...l, mode: 'emergency', status: 'emergency', phase: 'flash' })))}
            className="btn-danger flex items-center gap-2"
          >
            <MdFlashOn size={16} /> Activate Emergency
          </button>
          <button
            onClick={() => setLights(dummyLights)}
            className="btn-ghost flex items-center gap-2"
          >
            <MdRefresh size={16} /> Reset All
          </button>
        </div>
      </div>
    </div>
  )
}
