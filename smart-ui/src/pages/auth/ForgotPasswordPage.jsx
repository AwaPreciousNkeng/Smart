import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdEmail, MdShield, MdCheckCircle } from 'react-icons/md'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-neon mb-3">
            <MdShield size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Reset Password</h1>
          <p className="text-surface-300 text-sm mt-1">Enter your email to receive reset instructions</p>
        </div>

        <div className="glass rounded-2xl p-7">
          {sent ? (
            <div className="text-center py-4">
              <MdCheckCircle size={44} className="text-alert-green mx-auto mb-3" />
              <div className="font-display font-semibold text-white">Email sent!</div>
              <p className="text-sm text-surface-300 mt-1">Check your inbox for reset instructions.</p>
              <Link to="/login" className="btn-primary inline-block mt-5 text-sm">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text block mb-1.5">Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" size={17} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@sttms.cm" className="input-field pl-9" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Send Reset Link</button>
            </form>
          )}
          {!sent && (
            <p className="text-center text-xs text-surface-300 mt-4">
              <Link to="/login" className="text-primary-400 hover:text-primary-300">← Back to Sign In</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
