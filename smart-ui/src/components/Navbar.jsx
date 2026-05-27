import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdNotifications, MdMenu, MdLogout, MdSettings,
  MdPsychology, MdExpandMore, MdPerson,
} from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const PAGE_KEYS = {
  '/dashboard':   'Dashboard',
  '/live-traffic':'Live Traffic Monitor',
  '/incidents':   'Incident Management',
  '/analytics':   'Analytics & Reports',
  '/vehicles':    'Vehicle Registry',
  '/alerts':      'Emergency Alerts',
  '/users':       'User Management',
  '/settings':    'Settings',
  '/commuter':    'Commuter Portal',
  '/ai':          'AI Assistant',
}

const roleColors = {
  'Admin':              '#2563eb',
  'Traffic Analyst':    '#15803d',
  'Transport Operator': '#a16207',
  'Commuter':           '#7c3aed',
}

const roleBg = {
  'Admin':              '#eff6ff',
  'Traffic Analyst':    '#f0fdf4',
  'Transport Operator': '#fefce8',
  'Commuter':           '#f5f3ff',
}

const roleBorder = {
  'Admin':              '#bfdbfe',
  'Traffic Analyst':    '#bbf7d0',
  'Transport Operator': '#fde68a',
  'Commuter':           '#ddd6fe',
}

const STATIC_NOTIFS = [
  { id:1, type:'critical', title:'System Ready',  body:'SmartRoad STTMS is live and monitoring.', time:'Now',   read:false },
  { id:2, type:'info',     title:'Welcome',        body:'Welcome to SmartRoad — Cameroon STTMS.',  time:'Today', read:true  },
]

const FLAG = { en: '🇬🇧', fr: '🇫🇷' }

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [notifOpen,  setNotifOpen]  = useState(false)
  const [profOpen,   setProfOpen]   = useState(false)
  const [langOpen,   setLangOpen]   = useState(false)
  const [time,       setTime]       = useState(new Date())

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  const unread   = STATIC_NOTIFS.filter(n => !n.read).length
  const closeAll = () => { setNotifOpen(false); setProfOpen(false); setLangOpen(false) }

  const pageTitle = t(PAGE_KEYS[location.pathname] || 'Dashboard')
  const userColor  = roleColors[user?.role] || '#2563eb'
  const userBg     = roleBg[user?.role]     || '#eff6ff'
  const userBorder = roleBorder[user?.role] || '#bfdbfe'

  return (
    <>
      {(notifOpen || profOpen || langOpen) && (
        <div className="fixed inset-0 z-40" onClick={closeAll} />
      )}

      <header style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        background: 'linear-gradient(90deg, #ffffff 0%, #f8faff 100%)',
        borderBottom: '1px solid #e2e8f4',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        flexShrink: 0,
        boxShadow: '0 1px 8px rgba(37,99,235,0.06)',
      }}>

        {/* Mobile menu */}
        <button onClick={onMenuClick} className="lg:hidden"
          style={{ background:'none', border:'none', color:'#6b7280', cursor:'pointer', display:'flex', padding:6, borderRadius:6, transition:'background 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background='none'}>
          <MdMenu size={20} />
        </button>

        {/* Brand + breadcrumb */}
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
            <div style={{ width:28, height:28, borderRadius:6, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(37,99,235,0.35)' }}>
              <MdPsychology size={16} color="white" />
            </div>
            <span style={{ fontSize:13, fontWeight:800, color:'#1d4ed8', letterSpacing:'-0.02em' }}>SmartRoad</span>
          </div>
          <span style={{ color:'#cbd5e1', fontSize:14, fontWeight:300 }}>/</span>
          <span style={{ fontSize:13, fontWeight:600, color:'#334155', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {pageTitle}
          </span>
        </div>

        {/* Clock */}
        <div className="hidden md:block" style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#94a3b8', letterSpacing:'0.05em', flexShrink:0 }}>
          {time.toLocaleTimeString('en-GB')}
        </div>

        {/* LIVE badge */}
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:20, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', flexShrink:0 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#16a34a', boxShadow:'0 0 0 2px rgba(22,163,74,0.3)', animation:'pulse-dot 2s infinite' }} />
          <span style={{ fontSize:10, fontWeight:800, color:'#15803d', letterSpacing:'0.08em' }}>LIVE</span>
        </div>

        {/* AI button */}
        <button onClick={() => navigate('/ai')}
          style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:20, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #93c5fd', cursor:'pointer', transition:'all 0.15s', flexShrink:0 }}
          onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#dbeafe,#bfdbfe)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(37,99,235,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,#eff6ff,#dbeafe)'; e.currentTarget.style.boxShadow='none' }}>
          <MdPsychology size={14} color="#2563eb" />
          <span style={{ fontSize:11, fontWeight:700, color:'#1d4ed8' }}>AI</span>
        </button>

        {/* Language switcher */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button onClick={() => { setLangOpen(o=>!o); setNotifOpen(false); setProfOpen(false) }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:20, background:'#f8fafc', border:'1px solid #e2e8f0', cursor:'pointer', transition:'all 0.15s', fontSize:12, fontWeight:600, color:'#475569' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#2563eb'}
            onMouseLeave={e => { if (!langOpen) e.currentTarget.style.borderColor='#e2e8f0' }}>
            <span style={{ fontSize:14 }}>{FLAG[lang]}</span>
            <span style={{ letterSpacing:'0.02em' }}>{lang.toUpperCase()}</span>
            <MdExpandMore size={13} style={{ transition:'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div initial={{opacity:0,y:6,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.96}}
                transition={{duration:0.15}}
                style={{ position:'absolute', right:0, top:42, width:130, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', overflow:'hidden', zIndex:50 }}>
                {[{ code:'en', label:'English' }, { code:'fr', label:'Français' }].map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); closeAll() }}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'9px 14px', background: lang === l.code ? '#eff6ff' : 'none', border:'none', cursor:'pointer', fontSize:13, fontWeight: lang === l.code ? 700 : 500, color: lang === l.code ? '#1d4ed8' : '#374151', transition:'background 0.1s' }}
                    onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background='#f8fafc' }}
                    onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background='none' }}>
                    <span style={{ fontSize:16 }}>{FLAG[l.code]}</span>
                    {l.label}
                    {lang === l.code && <span style={{ marginLeft:'auto', fontSize:10, color:'#2563eb' }}>✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button onClick={() => { setNotifOpen(o=>!o); setProfOpen(false); setLangOpen(false) }}
            style={{ position:'relative', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.color='#2563eb'; e.currentTarget.style.background='#eff6ff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#64748b'; e.currentTarget.style.background='#f8fafc' }}>
            <MdNotifications size={17} />
            {unread > 0 && (
              <span style={{ position:'absolute', top:-3, right:-3, width:16, height:16, background:'linear-gradient(135deg,#ef4444,#dc2626)', borderRadius:'50%', fontSize:9, fontWeight:700, color:'white', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff', boxShadow:'0 1px 4px rgba(220,38,38,0.4)' }}>
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{opacity:0,y:6,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.96}}
                transition={{duration:0.15}}
                style={{ position:'absolute', right:0, top:42, width:310, background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, boxShadow:'0 12px 32px rgba(0,0,0,0.12)', overflow:'hidden', zIndex:50 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(90deg,#f8faff,#fff)' }}>
                  <span style={{ fontWeight:700, fontSize:13, color:'#0f172a' }}>{t('Notifications')}</span>
                  {unread > 0 && (
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626' }}>
                      {unread} new
                    </span>
                  )}
                </div>
                <div style={{ maxHeight:280, overflowY:'auto' }}>
                  {STATIC_NOTIFS.map(n => (
                    <div key={n.id} style={{ padding:'11px 16px', borderBottom:'1px solid #f8fafc', display:'flex', gap:10, background: !n.read ? 'linear-gradient(90deg,#f8fbff,#fff)' : '#fff', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background=!n.read?'linear-gradient(90deg,#f8fbff,#fff)':'#fff'}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background: n.type==='critical'?'#dc2626':n.type==='warning'?'#ca8a04':'#2563eb', marginTop:5, flexShrink:0, boxShadow:`0 0 0 3px ${n.type==='critical'?'rgba(220,38,38,0.15)':n.type==='warning'?'rgba(202,138,4,0.15)':'rgba(37,99,235,0.15)'}` }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{n.title}</div>
                        <div style={{ fontSize:12, color:'#64748b', marginTop:1, lineHeight:1.4 }}>{n.body}</div>
                        <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:'10px 16px', borderTop:'1px solid #f1f5f9', background:'#f8fafc' }}>
                  <button onClick={() => { navigate('/alerts'); closeAll() }}
                    style={{ width:'100%', fontSize:12, color:'#2563eb', background:'none', border:'none', cursor:'pointer', fontWeight:600, textAlign:'center' }}>
                    {lang === 'fr' ? 'Voir toutes les alertes' : 'View all alerts'} →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button onClick={() => { setProfOpen(o=>!o); setNotifOpen(false); setLangOpen(false) }}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px 4px 4px', borderRadius:24, background:'#f8fafc', border:'1px solid #e2e8f0', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.background='#f0f7ff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='#f8fafc' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${userColor},${userColor}cc)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', boxShadow:`0 2px 6px ${userColor}44` }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div style={{ fontSize:12, fontWeight:700, color:'#0f172a', lineHeight:1.2 }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ fontSize:10, fontWeight:600, color:userColor, lineHeight:1.2 }}>{t(user?.role || '')}</div>
            </div>
            <MdExpandMore size={14} color="#94a3b8" style={{ transition:'transform 0.2s', transform: profOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          <AnimatePresence>
            {profOpen && (
              <motion.div initial={{opacity:0,y:6,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.96}}
                transition={{duration:0.15}}
                style={{ position:'absolute', right:0, top:46, width:210, background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, boxShadow:'0 12px 32px rgba(0,0,0,0.12)', overflow:'hidden', zIndex:50 }}>

                {/* Profile header */}
                <div style={{ padding:'14px 16px 12px', background:`linear-gradient(135deg,${userBg},#fff)`, borderBottom:`1px solid ${userBorder}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${userColor},${userColor}cc)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'white', boxShadow:`0 3px 10px ${userColor}44`, flexShrink:0 }}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
                    </div>
                  </div>
                  <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:10, background:userBg, border:`1px solid ${userBorder}` }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:userColor }} />
                    <span style={{ fontSize:10, fontWeight:700, color:userColor }}>{t(user?.role || '')}</span>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding:6 }}>
                  {[
                    { icon:MdPerson,   label: lang==='fr' ? 'Mon profil' : 'My Profile', action:() => { navigate('/settings'); closeAll() } },
                    { icon:MdSettings, label: t('Settings'),                              action:() => { navigate('/settings'); closeAll() } },
                    { icon:MdLogout,   label: t('Sign Out'),                              action:() => { logout(); navigate('/login') }, danger:true },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:8, background:'none', border:'none', cursor:'pointer', color:item.danger?'#dc2626':'#374151', fontSize:13, fontWeight:500, textAlign:'left', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background=item.danger?'#fef2f2':'#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <item.icon size={15} /> {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}