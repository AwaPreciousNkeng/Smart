// ─── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    'Active':      'badge-red',
    'Monitoring':  'badge-yellow',
    'Resolved':    'badge-green',
    'online':      'badge-green',
    'offline':     'badge-red',
    'fault':       'badge-orange',
    'operational': 'badge-green',
    'delayed':     'badge-yellow',
    'disrupted':   'badge-red',
    'active':      'badge-green',
    'suspended':   'badge-yellow',
    'impounded':   'badge-red',
    'broadcast':   'badge-blue',
  }
  return <span className={map[status] || 'badge-blue'}>{status}</span>
}

// ─── Severity Badge ────────────────────────────────────────────────────────────
export function SeverityBadge({ severity }) {
  const map = {
    low:      'badge-green',
    medium:   'badge-yellow',
    high:     'badge-orange',
    critical: 'badge-red',
  }
  return <span className={map[severity] || 'badge-blue'}>{severity}</span>
}

// ─── Loading Spinner ───────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sz} border-2 border-primary-800 border-t-primary-400 rounded-full animate-spin`} />
    </div>
  )
}

// ─── Search Bar ────────────────────────────────────────────────────────────────
import { MdSearch } from 'react-icons/md'
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9"
      />
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
import { AnimatePresence, motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'
export function Modal({ open, onClose, title, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative glass-dark rounded-2xl border border-white/10 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} z-10`}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="section-title">{title}</h3>
              <button onClick={onClose} className="text-surface-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                <MdClose size={18} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ─── Alert Banner ──────────────────────────────────────────────────────────────
export function AlertBanner({ message, type = 'warning', onClose }) {
  const styles = {
    warning:  'bg-alert-yellow/10 border-alert-yellow/30 text-alert-yellow',
    error:    'bg-alert-red/10 border-alert-red/30 text-alert-red',
    success:  'bg-alert-green/10 border-alert-green/30 text-alert-green',
    info:     'bg-primary-500/10 border-primary-500/30 text-primary-300',
  }
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
          <MdClose size={16} />
        </button>
      )}
    </div>
  )
}

// ─── Traffic Summary Card ──────────────────────────────────────────────────────
export function TrafficCard({ label, value, sub, icon: Icon, color = 'blue', trend }) {
  const colors = {
    blue:   'text-primary-400 bg-primary-500/15',
    green:  'text-alert-green bg-alert-green/15',
    orange: 'text-alert-orange bg-alert-orange/15',
    red:    'text-alert-red bg-alert-red/15',
    yellow: 'text-alert-yellow bg-alert-yellow/15',
  }
  return (
    <div className="card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          {Icon && <Icon size={22} className={colors[color].split(' ')[0]} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-alert-red' : 'text-alert-green'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="value-text">{value}</div>
      <div className="label-text mt-1">{label}</div>
      {sub && <div className="text-xs text-surface-300 mt-1">{sub}</div>}
    </div>
  )
}

// ─── Chart Card ───────────────────────────────────────────────────────────────
export function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="text-xs text-surface-300 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

// ─── Status Pulse ──────────────────────────────────────────────────────────────
export function StatusPulse({ status }) {
  const colors = {
    online:  'bg-alert-green',
    offline: 'bg-alert-red',
    fault:   'bg-alert-orange',
    active:  'bg-alert-green',
  }
  const c = colors[status] || 'bg-surface-300'
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c} opacity-50`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c}`} />
    </span>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={40} className="text-surface-300 mb-3" />}
      <div className="font-display font-semibold text-white">{title}</div>
      {desc && <div className="text-sm text-surface-300 mt-1">{desc}</div>}
    </div>
  )
}
