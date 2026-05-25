import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdPerson, MdNotifications, MdLanguage, MdPalette, MdSecurity, MdSave } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { AlertBanner } from '../../components/UIComponents'

const Section = ({ icon: Icon, title, children }) => (
  <div className="card space-y-4">
    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
      <Icon size={18} className="text-primary-400" />
      <h3 className="section-title">{title}</h3>
    </div>
    {children}
  </div>
)

const Toggle = ({ label, sub, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm text-white font-medium">{label}</div>
      {sub && <div className="text-xs text-surface-300 mt-0.5">{sub}</div>}
    </div>
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-primary-600' : 'bg-surface-700'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
)

export default function SettingsPage() {
  const { user } = useAuth()
  const { dark, toggle } = useTheme()
  const [saved, setSaved] = useState(false)

  const [notifs, setNotifs] = useState({ incidents: true, alerts: true, sensors: false, reports: true, sms: false })
  const [lang, setLang] = useState('en')
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-surface-300 text-sm mt-1">Manage your profile, preferences and notifications</p>
      </div>

      {saved && <AlertBanner message="Settings saved successfully!" type="success" onClose={() => setSaved(false)} />}

      {/* Profile */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0 }}>
        <Section icon={MdPerson} title="Profile">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div className="font-display font-semibold text-white">{user?.name}</div>
              <div className="text-sm text-surface-300">{user?.email}</div>
              <div className="badge-blue text-[10px] mt-1">{user?.role}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-text block mb-1.5">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-text block mb-1.5">Email</label>
              <input type="email" defaultValue={user?.email} className="input-field" />
            </div>
            <div>
              <label className="label-text block mb-1.5">City</label>
              <select className="input-field">
                {['Douala','Yaoundé','Bafoussam','Garoua','Maroua'].map(c => (
                  <option key={c} selected={user?.city === c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.07 }}>
        <Section icon={MdPalette} title="Appearance">
          <Toggle label="Dark Mode" sub="Use dark theme across the platform" checked={dark} onChange={toggle} />
          <div>
            <div className="label-text mb-2">Accent Color</div>
            <div className="flex gap-2">
              {['#0a6bff','#8b5cf6','#06b6d4','#10b981','#f59e0b'].map(c => (
                <button key={c} className="w-7 h-7 rounded-full border-2 border-transparent hover:border-white transition-all"
                  style={{ background: c }} />
              ))}
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.12 }}>
        <Section icon={MdLanguage} title="Language & Region">
          <div>
            <label className="label-text block mb-1.5">Interface Language</label>
            <select className="input-field max-w-xs" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div>
            <label className="label-text block mb-1.5">Timezone</label>
            <select className="input-field max-w-xs">
              <option>Africa/Douala (WAT UTC+1)</option>
              <option>UTC</option>
            </select>
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.18 }}>
        <Section icon={MdNotifications} title="Notifications">
          <div className="space-y-4">
            <Toggle label="Incident Alerts" sub="Push notifications for new incidents" checked={notifs.incidents} onChange={v => setNotifs(n => ({...n, incidents: v}))} />
            <Toggle label="Emergency Broadcasts" sub="Receive all emergency alert broadcasts" checked={notifs.alerts} onChange={v => setNotifs(n => ({...n, alerts: v}))} />
            <Toggle label="Sensor Warnings" sub="Notify when sensors go offline or fault" checked={notifs.sensors} onChange={v => setNotifs(n => ({...n, sensors: v}))} />
            <Toggle label="Weekly Reports" sub="Receive analytics reports every Monday" checked={notifs.reports} onChange={v => setNotifs(n => ({...n, reports: v}))} />
            <Toggle label="SMS Notifications" sub="Receive critical alerts via SMS" checked={notifs.sms} onChange={v => setNotifs(n => ({...n, sms: v}))} />
          </div>
        </Section>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.24 }}>
        <Section icon={MdSecurity} title="Security">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text block mb-1.5">Current Password</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
            <div>
              <label className="label-text block mb-1.5">New Password</label>
              <input type="password" placeholder="••••••••" className="input-field" />
            </div>
          </div>
          <button className="btn-ghost text-sm">Update Password</button>
        </Section>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end pb-6">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <MdSave size={16} /> Save All Settings
        </button>
      </div>
    </div>
  )
}
