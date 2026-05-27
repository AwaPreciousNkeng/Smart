import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdPerson, MdEmail, MdLock, MdShield } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: ''})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await register(form)
    setLoading(false)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-neon mb-3">
            <MdShield size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-blue">Create Account</h1>
          <p className="text-surface-300 text-sm mt-1">Join the STTMS platform</p>
        </div>

        <div className="glass rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'firstName', label: 'First Name', icon: MdPerson, type: 'text', ph: 'PCodes' },
              { key: 'lastName', label: 'Last Name', icon: MdPerson, type: 'text', ph: 'PCodes' },
              { key: 'email', label: 'Email', icon: MdEmail, type: 'email', ph: 'pcodes@example.com' },
              { key: 'password', label: 'Password', icon: MdLock, type: 'password', ph: '••••••••' },
            ].map(({ key, label, icon: Icon, type, ph }) => (
              <div key={key}>
                <label className="label-text block mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" size={17} />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={update(key)}
                    placeholder={ph}
                    required
                    className="input-field pl-9"
                  />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-xs text-surface-300 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-700 hover:text-primary-300 transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
