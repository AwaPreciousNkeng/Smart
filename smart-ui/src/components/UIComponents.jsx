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
import { MdSearch, MdClose } from 'react-icons/md'
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9 pr-8"
        style={{ height: 38 }}
      />
      {value && (
        <button onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-100 transition-colors">
          <MdClose size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Form Field wrapper ────────────────────────────────────────────────────────
export function FormField({ label, hint, error, children, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
          {label}
          {required && <span style={{ color: '#ef4444', fontSize: 11 }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {error}</p>}
    </div>
  )
}

// ─── Error Banner (for form-level errors) ─────────────────────────────────────
export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 14px', borderRadius: 8,
      background: '#fef2f2', border: '1px solid #fecaca',
      color: '#b91c1c', fontSize: 12, lineHeight: 1.5,
    }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>⚠</span>
      {message}
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
import { AnimatePresence, motion } from 'framer-motion'
export function Modal({ open, onClose, title, subtitle, children, wide = false, icon }) {
  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,25,35,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: wide ? 680 : 480,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(15,25,35,0.20), 0 0 0 1px rgba(37,99,235,0.08)',
              overflow: 'hidden',
              maxHeight: 'calc(100vh - 32px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Blue top accent */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />

            {/* Header */}
            <div style={{
              padding: '18px 22px 16px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {icon && (
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {icon}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{title}</h3>
                  {subtitle && <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</p>}
                </div>
              </div>
              <button onClick={onClose}
                style={{ width: 28, height: 28, borderRadius: 7, background: 'none', border: '1px solid #e2e8f0', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e2e8f0' }}>
                <MdClose size={15} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 22px 22px', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ─── Alert Banner ──────────────────────────────────────────────────────────────
export function AlertBanner({ message, type = 'warning', onClose }) {
  const styles = {
    warning:  { bg: '#fefce8', border: '#fde68a', color: '#92400e' },
    error:    { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c' },
    success:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
    info:     { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  }
  const s = styles[type] || styles.info
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:8, background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontSize:13 }}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ marginLeft:12, opacity:0.7, background:'none', border:'none', cursor:'pointer', color:'inherit' }}>
          <MdClose size={15} />
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