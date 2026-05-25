import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MdNotifications, MdMenu, MdLogout, MdSettings, MdPsychology } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import { notifications as dummyNotifs } from '../data/trafficData'

const titles = {
  '/dashboard':'Dashboard','/live-traffic':'Live Traffic Monitor',
  '/incidents':'Incident Management','/transport':'Public Transport',
  '/analytics':'Analytics & Reports','/traffic-lights':'Traffic Light Control',
  '/vehicles':'Vehicle Registry','/alerts':'Emergency Alerts',
  '/sensors':'IoT Sensors','/users':'User Management',
  '/settings':'Settings','/commuter':'Commuter Portal','/ai':'AI Assistant',
}
const roleColors = {
  'Admin':'#1d4ed8','Traffic Analyst':'#15803d','Transport Operator':'#a16207',
  'Traffic Warden':'#c2410c','Commuter':'#6d28d9','Enforcement Officer':'#b91c1c',
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profOpen,  setProfOpen]  = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const unread = dummyNotifs.filter(n => !n.read).length
  const close  = () => { setNotifOpen(false); setProfOpen(false) }

  return (
    <>
      {(notifOpen || profOpen) && <div className="fixed inset-0 z-40" onClick={close} />}
      <header style={{ height:52, display:'flex', alignItems:'center', padding:'0 18px', gap:10, background:'#fff', borderBottom:'1px solid #dce4ef', position:'sticky', top:0, zIndex:20, flexShrink:0 }}>

        <button onClick={onMenuClick} className="lg:hidden"
          style={{ background:'none', border:'none', color:'#6b7280', cursor:'pointer', display:'flex', padding:4 }}>
          <MdMenu size={20} />
        </button>

        {/* Brand + breadcrumb */}
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13, fontWeight:800, color:'#2563eb', letterSpacing:'-0.01em' }}>SmartRoad</span>
          <span style={{ color:'#d1d5db', fontSize:14 }}>/</span>
          <span style={{ fontSize:13, fontWeight:500, color:'#374151' }}>{titles[location.pathname] || 'Dashboard'}</span>
        </div>

        {/* Clock */}
        <div className="hidden sm:block" style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:'#9ca3af', letterSpacing:'0.04em' }}>
          {time.toLocaleTimeString('en-GB')}
        </div>

        {/* LIVE */}
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:4, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#16a34a', animation:'pulse-dot 2s infinite' }} />
          <span style={{ fontSize:11, fontWeight:700, color:'#15803d', letterSpacing:'0.05em' }}>LIVE</span>
        </div>

        {/* AI button */}
        <button onClick={() => navigate('/ai')}
          style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:4, background:'#eff6ff', border:'1px solid #bfdbfe', cursor:'pointer', transition:'all 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background='#dbeafe'}
          onMouseLeave={e => e.currentTarget.style.background='#eff6ff'}>
          <MdPsychology size={15} color="#2563eb" />
          <span style={{ fontSize:11, fontWeight:700, color:'#1d4ed8' }}>AI</span>
        </button>

        {/* Notifications */}
        <div style={{ position:'relative' }}>
          <button onClick={() => { setNotifOpen(o=>!o); setProfOpen(false) }}
            style={{ position:'relative', background:'#fff', border:'1px solid #e5e7eb', borderRadius:5, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#6b7280', transition:'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.color='#2563eb' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#6b7280' }}>
            <MdNotifications size={17} />
            {unread > 0 && (
              <span style={{ position:'absolute', top:-3, right:-3, width:15, height:15, background:'#dc2626', borderRadius:'50%', fontSize:9, fontWeight:700, color:'white', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:5}}
                style={{ position:'absolute', right:0, top:40, width:300, background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', overflow:'hidden', zIndex:50 }}>
                <div style={{ padding:'11px 14px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>Notifications</span>
                  <span className="badge badge-red">{unread} new</span>
                </div>
                <div style={{ maxHeight:270, overflowY:'auto' }}>
                  {dummyNotifs.map(n => (
                    <div key={n.id} style={{ padding:'9px 14px', borderBottom:'1px solid #f9fafb', display:'flex', gap:9, background:!n.read?'#f8fbff':'#fff' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:n.type==='critical'?'#dc2626':n.type==='warning'?'#ca8a04':'#2563eb', marginTop:5, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{n.title}</div>
                        <div style={{ fontSize:12, color:'#6b7280', marginTop:1, lineHeight:1.4 }}>{n.body}</div>
                        <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:'8px 14px', borderTop:'1px solid #f3f4f6', textAlign:'center' }}>
                  <button onClick={() => { navigate('/alerts'); close() }} style={{ fontSize:12, color:'#2563eb', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>
                    View all →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div style={{ position:'relative' }}>
          <button onClick={() => { setProfOpen(o=>!o); setNotifOpen(false) }}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'4px 9px 4px 5px', borderRadius:5, background:'#fff', border:'1px solid #e5e7eb', cursor:'pointer', transition:'all 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#2563eb'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#e5e7eb'}>
            <div style={{ width:24, height:24, borderRadius:4, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white' }}>
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div style={{ fontSize:12, fontWeight:600, color:'#0f1923', lineHeight:1.2 }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ fontSize:10, fontWeight:600, color:roleColors[user?.role]||'#2563eb', lineHeight:1.2 }}>{user?.role}</div>
            </div>
          </button>
          <AnimatePresence>
            {profOpen && (
              <motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:5}}
                style={{ position:'absolute', right:0, top:42, width:190, background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', overflow:'hidden', zIndex:50 }}>
                <div style={{ padding:'11px 14px', borderBottom:'1px solid #f3f4f6' }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{user?.name}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', marginTop:1 }}>{user?.email}</div>
                  <div className="badge badge-blue" style={{ marginTop:5, fontSize:10 }}>{user?.role}</div>
                </div>
                <div style={{ padding:5 }}>
                  {[
                    { icon:MdSettings, label:'Settings', action:() => { navigate('/settings'); close() } },
                    { icon:MdLogout,   label:'Sign Out', action:() => { logout(); navigate('/login') }, danger:true },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'7px 10px', borderRadius:4, background:'none', border:'none', cursor:'pointer', color:item.danger?'#b91c1c':'#374151', fontSize:13, fontWeight:500, textAlign:'left', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background=item.danger?'#fef2f2':'#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <item.icon size={14} /> {item.label}
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
