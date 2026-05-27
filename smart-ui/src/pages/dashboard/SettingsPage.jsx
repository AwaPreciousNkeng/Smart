import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdPerson, MdNotifications, MdLanguage, MdPalette,
  MdSecurity, MdSave, MdLock, MdCheckCircle,
} from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { authAPI } from '../../services/api'

const Section = ({ icon: Icon, title, subtitle, children, color = '#2563eb' }) => (
  <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
    <div style={{ padding:'16px 20px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:12, background:'linear-gradient(180deg,#f8faff,#fff)' }}>
      <div style={{ width:34, height:34, borderRadius:9, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:'#64748b', marginTop:1 }}>{subtitle}</div>}
      </div>
    </div>
    <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:16 }}>
      {children}
    </div>
  </div>
)

const Toggle = ({ label, sub, checked, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
    <div>
      <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{sub}</div>}
    </div>
    <button onClick={() => onChange(!checked)}
      style={{ position:'relative', width:40, height:22, borderRadius:99, border:'none', cursor:'pointer', transition:'background 0.2s', background:checked?'#2563eb':'#e2e8f0', flexShrink:0 }}>
      <span style={{ position:'absolute', top:3, left: checked?19:3, width:16, height:16, borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.2)', transition:'left 0.2s' }} />
    </button>
  </div>
)

const FieldRow = ({ label, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    <label style={{ fontSize:12, fontWeight:600, color:'#475569' }}>{label}</label>
    {children}
  </div>
)

export default function SettingsPage() {
  const { user } = useAuth()
  const { lang, setLang } = useLanguage()
  const [saved,    setSaved]    = useState(false)
  const [pwError,  setPwError]  = useState('')
  const [pwSaved,  setPwSaved]  = useState(false)
  const [saving,   setSaving]   = useState(false)

  const [notifs, setNotifs] = useState({
    incidents: true, alerts: true, reports: true, sms: false,
  })

  const [name,    setName]    = useState(user?.name || '')
  const [pwForm,  setPwForm]  = useState({ current:'', newPw:'', confirm:'' })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match'); return }
    if (pwForm.newPw.length < 6) { setPwError('Password must be at least 6 characters'); return }
    setSaving(true)
    setPwError('')
    try {
      await authAPI.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
      setPwSaved(true)
      setPwForm({ current:'', newPw:'', confirm:'' })
      setTimeout(() => setPwSaved(false), 3000)
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const updPw = k => e => setPwForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ maxWidth:680, display:'flex', flexDirection:'column', gap:16 }}>
      <div>
        <div className="page-title">Settings</div>
        <p style={{ fontSize:13, color:'#64748b', marginTop:4 }}>Manage your profile, preferences and security</p>
      </div>

      {saved && (
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:8, background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#15803d', fontSize:13, fontWeight:500 }}>
          <MdCheckCircle size={16} /> Settings saved successfully!
        </motion.div>
      )}

      {/* Profile */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0 }}>
        <Section icon={MdPerson} title="Profile" subtitle="Your public identity on the platform">
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', borderRadius:10, background:'#f8faff', border:'1px solid #e2e8f0' }}>
            <div style={{ width:52, height:52, borderRadius:12, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'white', flexShrink:0, boxShadow:'0 4px 12px rgba(37,99,235,0.3)' }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#0f172a' }}>{user?.name}</div>
              <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{user?.email}</div>
              <span style={{ display:'inline-block', marginTop:5, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10, background:'#eff6ff', border:'1px solid #bfdbfe', color:'#2563eb' }}>{user?.role}</span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <FieldRow label="Full Name">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
            </FieldRow>
            <FieldRow label="Email">
              <input type="email" defaultValue={user?.email} className="input-field" disabled style={{ opacity:0.6, cursor:'not-allowed' }} />
            </FieldRow>
          </div>
          <button onClick={handleSave} className="btn-primary" style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:7 }}>
            <MdSave size={15} /> Save Profile
          </button>
        </Section>
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.06 }}>
        <Section icon={MdLanguage} title="Language & Region" subtitle="Interface language and time settings" color="#7c3aed">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <FieldRow label="Interface Language">
              <select className="input-field" value={lang} onChange={e => setLang(e.target.value)}>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </FieldRow>
            <FieldRow label="Timezone">
              <select className="input-field">
                <option>Africa/Douala (WAT UTC+1)</option>
                <option>UTC</option>
              </select>
            </FieldRow>
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}>
        <Section icon={MdNotifications} title="Notifications" subtitle="Control what you get alerted about" color="#ea580c">
          <Toggle label="Incident Alerts" sub="Push notifications for new traffic incidents" checked={notifs.incidents} onChange={v => setNotifs(n => ({...n, incidents:v}))} />
          <Toggle label="Emergency Broadcasts" sub="Receive all emergency alert broadcasts" checked={notifs.alerts} onChange={v => setNotifs(n => ({...n, alerts:v}))} />
          <Toggle label="Weekly Reports" sub="Receive analytics reports every Monday" checked={notifs.reports} onChange={v => setNotifs(n => ({...n, reports:v}))} />
          <Toggle label="SMS Notifications" sub="Receive critical alerts via SMS to your phone" checked={notifs.sms} onChange={v => setNotifs(n => ({...n, sms:v}))} />
        </Section>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
        <Section icon={MdPalette} title="Appearance" subtitle="Personalise the platform look" color="#16a34a">
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:'#475569', marginBottom:10 }}>Accent Colour</div>
            <div style={{ display:'flex', gap:10 }}>
              {[
                { c:'#2563eb', l:'Blue' }, { c:'#7c3aed', l:'Purple' },
                { c:'#0891b2', l:'Cyan' }, { c:'#16a34a', l:'Green'  },
                { c:'#ea580c', l:'Orange'},
              ].map(({ c, l }) => (
                <button key={c} title={l}
                  style={{ width:28, height:28, borderRadius:'50%', background:c, border:'3px solid white', boxShadow:`0 0 0 2px ${c}60`, cursor:'pointer', transition:'transform 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                />
              ))}
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}>
        <Section icon={MdSecurity} title="Security" subtitle="Update your password" color="#dc2626">
          <form onSubmit={handlePasswordChange} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {pwError && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:8, background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c', fontSize:12 }}>
                ⚠ {pwError}
              </div>
            )}
            {pwSaved && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:8, background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#15803d', fontSize:12 }}>
                <MdCheckCircle size={14}/> Password updated successfully!
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <FieldRow label="Current Password">
                <input type="password" value={pwForm.current} onChange={updPw('current')} placeholder="••••••••" className="input-field" required />
              </FieldRow>
              <FieldRow label="New Password">
                <input type="password" value={pwForm.newPw} onChange={updPw('newPw')} placeholder="••••••••" className="input-field" required minLength={6} />
              </FieldRow>
              <FieldRow label="Confirm New">
                <input type="password" value={pwForm.confirm} onChange={updPw('confirm')} placeholder="••••••••" className="input-field" required />
              </FieldRow>
            </div>
            <button type="submit" disabled={saving} className="btn-ghost" style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:7 }}>
              <MdLock size={14}/> {saving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </Section>
      </motion.div>

      <div style={{ height:24 }} />
    </div>
  )
}