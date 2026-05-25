import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdEdit, MdDelete, MdPeople, MdAdminPanelSettings } from 'react-icons/md'
import { users as dummyUsers, roleColors } from '../../data/users'
import { SearchBar, Modal } from '../../components/UIComponents'

const roles = ['Admin','Traffic Analyst','Transport Operator','Traffic Warden','Commuter','Enforcement Officer']

export default function UsersPage() {
  const [users, setUsers] = useState(dummyUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-surface-300 text-sm mt-1">Manage platform users, roles and permissions</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <MdAdd size={18} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {roles.map(r => (
          <div key={r} className="card text-center py-3">
            <div className="value-text text-xl">{users.filter(u => u.role === r).length}</div>
            <div className="text-[10px] text-surface-300 mt-1 leading-tight">{r}</div>
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
              {r}
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
                {['#','Name','Email','Role','Phone','City','Joined','Actions'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/3 transition-colors">
                  <td className="table-cell text-surface-300 text-xs">{i + 1}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-surface-300 text-xs">{u.email}</td>
                  <td className="table-cell"><span className={roleColors[u.role] || 'badge-blue'}>{u.role}</span></td>
                  <td className="table-cell text-xs text-surface-300">{u.phone}</td>
                  <td className="table-cell text-xs text-surface-300">{u.city}</td>
                  <td className="table-cell text-xs text-surface-300">{u.createdAt}</td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button onClick={() => setEditUser(u)} className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all" title="Edit">
                        <MdEdit size={14} />
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg bg-alert-red/10 text-alert-red hover:bg-alert-red/20 transition-all" title="Delete">
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="table-cell text-center text-surface-300 py-10">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={addOpen || !!editUser} onClose={() => { setAddOpen(false); setEditUser(null) }}
        title={editUser ? `Edit ${editUser.name}` : 'Add New User'}>
        <div className="space-y-4">
          {[
            { label: 'Full Name', type: 'text', ph: 'Jean Dupont', val: editUser?.name || '' },
            { label: 'Email', type: 'email', ph: 'user@sttms.cm', val: editUser?.email || '' },
            { label: 'Phone', type: 'tel', ph: '+237 677 000 000', val: editUser?.phone || '' },
            { label: 'City', type: 'text', ph: 'Douala', val: editUser?.city || '' },
          ].map(f => (
            <div key={f.label}>
              <label className="label-text block mb-1.5">{f.label}</label>
              <input type={f.type} placeholder={f.ph} defaultValue={f.val} className="input-field" />
            </div>
          ))}
          <div>
            <label className="label-text block mb-1.5">Role</label>
            <select className="input-field" defaultValue={editUser?.role || ''}>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          {!editUser && (
            <div>
              <label className="label-text block mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setAddOpen(false); setEditUser(null) }} className="btn-ghost flex-1">Cancel</button>
            <button onClick={() => { setAddOpen(false); setEditUser(null) }} className="btn-primary flex-1">
              {editUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
