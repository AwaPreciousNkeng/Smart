import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdPeople, MdShield, MdPerson } from 'react-icons/md'
import { SearchBar, Modal } from '../../components/UIComponents'
import { usersAPI, authAPI } from '../../services/api'

const ROLE_DISPLAY = {
  ADMIN:           'Admin',
  USER:            'Commuter',
  MINISTRY:        'Traffic Analyst',
  TRAFFIC_OFFICER: 'Transport Operator',
}

// Display name → backend Role enum value
const DISPLAY_TO_ROLE = {
  'Admin':              'ADMIN',
  'Commuter':           'USER',
  'Traffic Analyst':    'MINISTRY',
  'Transport Operator': 'TRAFFIC_OFFICER',
}

const ROLE_OPTIONS = [
  { value:'ADMIN',           label:'Admin',              icon:'🛡️', desc:'Full system access and user management' },
  { value:'MINISTRY',        label:'Traffic Analyst',    icon:'📊', desc:'View analytics and generate reports' },
  { value:'TRAFFIC_OFFICER', label:'Transport Operator', icon:'🚦', desc:'Respond to and update incident statuses' },
  { value:'USER',            label:'Commuter',           icon:'🚌', desc:'Report incidents and view public alerts' },
]

const roleBadge = {
  Admin:              'badge-blue',
  Commuter:           'badge-green',
  'Traffic Analyst':  'badge-yellow',
  'Transport Operator':'badge-orange',
}

const roleIcon = {
  Admin:              '🛡️',
  Commuter:           '🚌',
  'Traffic Analyst':  '📊',
  'Transport Operator':'🚦',
}

const EMPTY_FORM = { firstName:'', lastName:'', email:'', password:'', role:'MINISTRY' }

export default function UsersPage() {
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [addOpen,    setAddOpen]    = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [form,       setForm]       = useState(EMPTY_FORM)

  const fetchUsers = () => {
    usersAPI.getAll()
      .then(r => setUsers(r.data))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const roles = ['Admin', 'Commuter', 'Traffic Analyst', 'Transport Operator']

  const mapped = users.map(u => ({ ...u, displayRole: ROLE_DISPLAY[u.role] || u.role }))

  const filtered = mapped.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    const matchRole   = roleFilter === 'all' || u.displayRole === roleFilter
    return matchSearch && matchRole
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await authAPI.createUser(form)
      await fetchUsers()
      setAddOpen(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const selectedRoleOption = ROLE_OPTIONS.find(r => r.value === form.role)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-surface-300 text-sm mt-1">Manage platform users, roles and permissions</p>
        </div>
        <button onClick={() => { setAddOpen(true); setError('') }} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {roles.map(r => (
          <div key={r} className="card text-center py-3 cursor-pointer hover:border-primary-500/30 transition-all"
            onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}>
            <div className="text-xl mb-1">{roleIcon[r]}</div>
            <div className="value-text text-2xl">{mapped.filter(u => u.displayRole === r).length}</div>
            <div className="text-xs text-surface-300 mt-1">{r}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48 max-w-xs">
          <SearchBar value={search} onChange={setSearch} placeholder="Search name or email…" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === 'all' ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
            All Roles
          </button>
          {roles.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === r ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-surface-300 hover:bg-white/10'}`}>
              {roleIcon[r]} {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-surface-300 text-sm">Loading users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  {['#', 'Name', 'Email', 'Role', 'Joined'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/3 transition-colors">
                    <td className="table-cell text-surface-300 text-xs">{i + 1}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {u.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-white font-medium text-sm">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="table-cell text-surface-300 text-xs">{u.email}</td>
                    <td className="table-cell">
                      <span className={`${roleBadge[u.displayRole] || 'badge-blue'} flex items-center gap-1 w-fit`}>
                        <span style={{ fontSize:11 }}>{roleIcon[u.displayRole]}</span>
                        {u.displayRole}
                      </span>
                    </td>
                    <td className="table-cell text-xs text-surface-300">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="table-cell text-center text-surface-300 py-10">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setError(''); setForm(EMPTY_FORM) }} title="Add New User">
        <form onSubmit={handleAdd} className="space-y-4">
          {error && <div className="text-xs text-alert-red bg-alert-red/10 rounded-lg px-3 py-2">{error}</div>}

          {/* Role selector */}
          <div>
            <label className="label-text block mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    form.role === opt.value
                      ? 'border-primary-500/60 bg-primary-500/10'
                      : 'border-white/10 bg-white/3 hover:bg-white/5'
                  }`}>
                  <div className="text-lg mb-1">{opt.icon}</div>
                  <div className="text-white font-semibold text-xs">{opt.label}</div>
                  <div className="text-surface-300 text-xs mt-0.5 leading-tight">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-1.5">First Name</label>
              <input type="text" value={form.firstName} onChange={upd('firstName')} required
                className="input-field" placeholder="Jean" />
            </div>
            <div>
              <label className="label-text block mb-1.5">Last Name</label>
              <input type="text" value={form.lastName} onChange={upd('lastName')} required
                className="input-field" placeholder="Dupont" />
            </div>
          </div>

          <div>
            <label className="label-text block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={upd('email')} required
              className="input-field" placeholder="user@sttms.cm" />
          </div>

          <div>
            <label className="label-text block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={upd('password')} required minLength={6}
              className="input-field" placeholder="••••••••" />
          </div>

          {selectedRoleOption && (
            <div className="flex items-start gap-2 text-xs text-surface-300 bg-white/5 rounded-lg px-3 py-2">
              <MdShield size={13} className="flex-shrink-0 mt-0.5" />
              Creating a <strong className="text-white">{selectedRoleOption.label}</strong> account — {selectedRoleOption.desc}.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setAddOpen(false); setError(''); setForm(EMPTY_FORM) }} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Creating…' : `Create ${selectedRoleOption?.label || 'User'}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}