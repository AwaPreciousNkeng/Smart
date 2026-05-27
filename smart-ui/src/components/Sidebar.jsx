import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdDashboard, MdTraffic, MdWarning, MdBarChart,
  MdDirectionsCar, MdNotificationsActive,
  MdPeople, MdSettings, MdLogout, MdSmartphone,
  MdClose, MdPsychology
} from 'react-icons/md'
import { useAuth } from '../context/AuthContext'

const nav = [
  { section:'OVERVIEW', items:[
    { label:'Dashboard',       icon:MdDashboard,           path:'/dashboard',      roles:null },
    { label:'Live Traffic',    icon:MdTraffic,             path:'/live-traffic',   roles:null },
    { label:'Analytics',       icon:MdBarChart,            path:'/analytics',      roles:null },
  ]},
  { section:'OPERATIONS', items:[
    { label:'Incidents',       icon:MdWarning,             path:'/incidents',      roles:null },
    { label:'Vehicles',        icon:MdDirectionsCar,       path:'/vehicles',       roles:null },
  ]},
  { section:'SAFETY & AI', items:[
    { label:'Emergency Alerts',icon:MdNotificationsActive, path:'/alerts',         roles:null },
    { label:'AI Assistant',    icon:MdPsychology,          path:'/ai',             roles:null, badge:'AI' },
  ]},
  { section:'ADMIN', items:[
    { label:'Users',           icon:MdPeople,              path:'/users',          roles:['Admin'] },
    { label:'Commuter Portal', icon:MdSmartphone,          path:'/commuter',       roles:null },
    { label:'Settings',        icon:MdSettings,            path:'/settings',       roles:null },
  ]},
]

const roleColors = {
  'Admin':'#1d4ed8','Traffic Analyst':'#15803d','Transport Operator':'#a16207',
  'Commuter':'#6d28d9',
}

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setOpen(false)} />
        )}
      </AnimatePresence>

      <motion.div initial={false} animate={{ x: open ? 0 : '-100%' }}
        className="fixed lg:static lg:translate-x-0 top-0 left-0 h-screen z-40 flex flex-col"
        style={{ width:230, minWidth:230, background:'#fff', borderRight:'1px solid #dce4ef', flexShrink:0, overflowY:'auto' }}>

        {/* Brand */}
        <div style={{ padding:'14px 14px 12px', borderBottom:'1px solid #dce4ef' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:6, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <MdTraffic size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'#0f1923', letterSpacing:'-0.02em' }}>SmartRoad</div>
              <div style={{ fontSize:10, color:'#9ca3af', fontWeight:500, letterSpacing:'0.04em' }}>Cameroun · STTMS v2</div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden ml-auto"
              style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:2 }}>
              <MdClose size={17} />
            </button>
          </div>
          <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:6, padding:'5px 8px', borderRadius:4, background:'#eff6ff', border:'1px solid #bfdbfe' }}>
            <MdPsychology size={13} color="#2563eb" />
            <span style={{ fontSize:11, fontWeight:600, color:'#1d4ed8' }}>AI-Powered Traffic Intelligence</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'6px 8px' }}>
          {nav.map(group => {
            const items = group.items.filter(i => !i.roles || i.roles.includes(user?.role))
            if (!items.length) return null
            return (
              <div key={group.section}>
                <div className="nav-section">{group.section}</div>
                {items.map(item => (
                  <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <item.icon size={16} style={{ flexShrink:0 }} />
                    <span style={{ flex:1 }}>{item.label}</span>
                    {item.badge && <span className="badge-ai">{item.badge}</span>}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <div style={{ borderTop:'1px solid #dce4ef', padding:'10px 8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:5, background:'#f8fafc', border:'1px solid #dce4ef', marginBottom:4 }}>
            <div style={{ width:28, height:28, borderRadius:5, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#0f1923', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize:10, fontWeight:600, color: roleColors[user?.role]||'#2563eb', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'6px 10px', borderRadius:5, background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:12, fontWeight:500, transition:'all 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#b91c1c' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6b7280' }}>
            <MdLogout size={14} /> Sign Out
          </button>
        </div>
      </motion.div>
    </>
  )
}