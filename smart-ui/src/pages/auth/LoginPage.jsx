import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdTraffic, MdPsychology } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'

const demos = [
  { role:'Admin',              email:'admin@smartroad.cm',    pw:'admin123',    color:'#1d4ed8' },
  { role:'Traffic Analyst',    email:'analyst@smartroad.cm',  pw:'analyst123',  color:'#15803d' },
  { role:'Transport Operator', email:'officer@smartroad.cm',  pw:'officer123',  color:'#a16207' },
  { role:'Commuter',           email:'commuter@smartroad.cm', pw:'commuter123', color:'#6d28d9' },
]

export default function LoginPage() {
  const [email,   setEmail]   = useState('')
  const [pw,      setPw]      = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, pw)
    setLoading(false)
    if (ok) navigate('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'Inter,sans-serif', background:'#f0f4f8' }}>

      {/* Left panel */}
      <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:0.5}}
        className="hidden lg:flex"
        style={{ width:480, background:'#2563eb', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 52px', position:'relative', overflow:'hidden' }}>

        {/* Grid background */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:52 }}>
            <div style={{ width:40, height:40, borderRadius:8, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.2)' }}>
              <MdTraffic size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:'white', letterSpacing:'-0.02em' }}>SmartRoad</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>Cameroun · STTMS v2</div>
            </div>
          </div>

          <h1 style={{ fontSize:34, fontWeight:800, color:'white', letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:16 }}>
            Intelligent Traffic<br />Management for<br />Cameroon
          </h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.7, marginBottom:40, maxWidth:340 }}>
            Real-time monitoring, AI-powered incident detection and smart transport coordination across all 10 regions — from Douala to Buea, Yaoundé to Garoua.
          </p>

          {/* AI badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:6, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', marginBottom:36 }}>
            <MdPsychology size={16} color="white" />
            <span style={{ fontSize:12, fontWeight:600, color:'white' }}>Now with AI Traffic Intelligence</span>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[
              { v:'12+', l:'Cities Covered' },
              { v:'240+', l:'IoT Sensors' },
              { v:'48', l:'Bus Routes' },
              { v:'10', l:'Cameroon Regions' },
            ].map(s => (
              <div key={s.l} style={{ padding:'14px 16px', borderRadius:6, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'white', letterSpacing:'-0.02em' }}>{s.v}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginTop:3, fontWeight:500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cameroon regions */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Coverage</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {['Adamawa','Centre','East','Far North','Littoral','North','North-West','South','South-West','West'].map(r => (
              <span key={r} style={{ fontSize:11, fontWeight:500, padding:'3px 9px', borderRadius:3, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.85)' }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.5}}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'40px 24px' }}>

        <div style={{ width:'100%', maxWidth:400 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
            <div style={{ width:34, height:34, borderRadius:7, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <MdTraffic size={19} color="white" />
            </div>
            <div style={{ fontWeight:800, fontSize:16, color:'#0f1923' }}>SmartRoad Cameroun</div>
          </div>

          <div style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#0f1923', letterSpacing:'-0.02em', marginBottom:5 }}>Sign in</h2>
            <p style={{ fontSize:13, color:'#6b7280' }}>Access the SmartRoad traffic management platform</p>
          </div>

          {error && (
            <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
              style={{ marginBottom:16, padding:'10px 14px', borderRadius:6, background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c', fontSize:13 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Email address</label>
              <div style={{ position:'relative' }}>
                <MdEmail style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }} size={16}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@smartroad.cm" required className="input" style={{paddingLeft:36}}/>
              </div>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize:12, color:'#2563eb', textDecoration:'none', fontWeight:500 }}>Forgot password?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <MdLock style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }} size={16}/>
                <input type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter your password" required className="input" style={{paddingLeft:36,paddingRight:38}}/>
                <button type="button" onClick={()=>setShowPw(v=>!v)}
                  style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#9ca3af', cursor:'pointer', display:'flex', alignItems:'center' }}>
                  {showPw ? <MdVisibilityOff size={16}/> : <MdVisibility size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
              style={{ width:'100%', justifyContent:'center', marginTop:4 }}>
              {loading ? (
                <><div style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid white',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'#6b7280', marginTop:20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#2563eb', textDecoration:'none', fontWeight:600 }}>Create account</Link>
          </p>

          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'22px 0 14px' }}>
            <div style={{ flex:1, height:1, background:'#e5e7eb' }}/>
            <span style={{ fontSize:11, color:'#9ca3af', fontWeight:600, whiteSpace:'nowrap' }}>DEMO ACCOUNTS</span>
            <div style={{ flex:1, height:1, background:'#e5e7eb' }}/>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {demos.map(d => (
              <button key={d.email} onClick={()=>{setEmail(d.email);setPw(d.pw)}}
                style={{ textAlign:'left', padding:'9px 12px', borderRadius:6, background:'white', border:'1px solid #e5e7eb', cursor:'pointer', transition:'all 0.12s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#bfdbfe';e.currentTarget.style.background='#f8fbff'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.background='white'}}>
                <div style={{ fontSize:12, fontWeight:700, color:d.color, marginBottom:2 }}>{d.role}</div>
                <div style={{ fontSize:11, color:'#9ca3af', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.email}</div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
