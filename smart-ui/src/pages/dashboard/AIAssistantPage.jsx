import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdPsychology, MdSend, MdRefresh, MdLightbulb, MdWarning, MdBarChart, MdDirectionsCar } from 'react-icons/md'
import { incidents, roads, alerts, sensors } from '../../data/trafficData'
import { allRoads } from '../../data/cameroonCities'

const SUGGESTIONS = [
  'What is the current traffic situation in Buea?',
  'Which roads in Douala are critically congested right now?',
  'Summarise all active incidents and recommend actions',
  'What sensors are offline and what should we do?',
  'Predict congestion for the next 2 hours in Yaoundé',
  'Generate a traffic report for all South-West region roads',
  'Which bus routes are disrupted and what is the impact?',
  'Recommend signal timing adjustments for peak hour today',
]

// Build context summary for the AI
const buildContext = () => {
  const activeInc = incidents.filter(i => i.status !== 'Resolved')
  const criticalRoads = allRoads.filter(r => r.congestion === 'critical' || r.congestion === 'high')
  const offlineSensors = sensors.filter(s => s.status !== 'online')
  const activeAlerts = alerts.filter(a => a.status === 'active')
  const bueaRoads = allRoads.filter(r => r.city === 'Buea')

  return `You are the AI Traffic Intelligence Assistant for SmartRoad Cameroun — a Smart Traffic and Transport Management System (STTMS) covering all regions of Cameroon including Douala, Yaoundé, Buea, Limbe, Bamenda, Bafoussam and other cities.

CURRENT SYSTEM STATE (live data):

Active Incidents (${activeInc.length}):
${activeInc.map(i => `- ${i.id}: ${i.type} at ${i.road}, ${i.city} — Severity: ${i.severity} — ${i.description}`).join('\n')}

High/Critical Roads (${criticalRoads.length}):
${criticalRoads.map(r => `- ${r.name}, ${r.city} (${r.region}): ${r.congestion} congestion, ${r.density}% density, ${r.speed} km/h avg speed`).join('\n')}

Buea Roads:
${bueaRoads.map(r => `- ${r.name}: ${r.congestion} congestion, ${r.density}% density, ${r.speed} km/h`).join('\n')}

Offline/Fault Sensors (${offlineSensors.length}):
${offlineSensors.map(s => `- ${s.id}: ${s.type} at ${s.location}, ${s.city} — Status: ${s.status}, Battery: ${s.battery}%`).join('\n')}

Active Alerts (${activeAlerts.length}):
${activeAlerts.map(a => `- ${a.type}: ${a.message} (${a.city}, ${a.severity})`).join('\n')}

You are a helpful, precise and professional traffic management AI. Give practical, actionable recommendations. Be concise but thorough. Format your responses clearly with bullet points or numbered steps where appropriate. Always consider road safety, emergency response times and commuter impact. When discussing Buea, mention specific roads: Molyko Main Road, Buea-Mutengene Highway, Mile 17 Junction, Great Soppo Road.`
}

const callAI = async (messages) => {
  const systemContext = buildContext()
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemContext,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })
  const data = await response.json()
  return data.content?.[0]?.text || 'Sorry, I could not generate a response. Please try again.'
}

export default function AIAssistantPage() {
  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')
    setError('')

    const newMessages = [...messages, { role: 'user', content: q }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const reply = await callAI(newMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError('Failed to connect to AI. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setMessages([]); setInput(''); setError('') }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, height:'calc(100vh - 100px)' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10, flexShrink:0 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:6, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <MdPsychology size={20} color="white" />
            </div>
            <div>
              <div className="page-title">AI Traffic Assistant</div>
              <div className="page-sub">Powered by Claude · Real-time Cameroon traffic intelligence</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ghost btn-sm" onClick={reset} style={{gap:5}}>
            <MdRefresh size={13}/> New Session
          </button>
          <div className="badge-ai" style={{padding:'5px 10px',fontSize:11,display:'flex',alignItems:'center',gap:4}}>
            <MdPsychology size={12}/> Claude AI
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:16, flex:1, minHeight:0 }}>

        {/* Chat area */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingRight:4 }}>
            {messages.length === 0 && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16 }}>
                <div style={{ width:56, height:56, borderRadius:10, background:'#eff6ff', border:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MdPsychology size={28} color="#2563eb" />
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:16, fontWeight:700, color:'#0f1923', marginBottom:4 }}>SmartRoad AI Assistant</div>
                  <div style={{ fontSize:13, color:'#6b7280', maxWidth:380, lineHeight:1.6 }}>
                    Ask me anything about current traffic conditions, incidents, sensor status, route recommendations or generate traffic reports for any city in Cameroon including Buea, Douala, Yaoundé and more.
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <AnimatePresence key={i}>
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  style={{ display:'flex', gap:10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  {/* Avatar */}
                  <div style={{ width:28, height:28, borderRadius:5, background: m.role === 'user' ? '#2563eb' : '#f0fdf4', border: m.role === 'assistant' ? '1px solid #bbf7d0' : 'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    {m.role === 'user'
                      ? <span style={{fontSize:12,fontWeight:700,color:'white'}}>U</span>
                      : <MdPsychology size={15} color="#16a34a"/>}
                  </div>
                  {/* Bubble */}
                  <div style={{
                    maxWidth:'80%',
                    background: m.role === 'user' ? '#eff6ff' : '#fff',
                    border: `1px solid ${m.role === 'user' ? '#bfdbfe' : '#dce4ef'}`,
                    borderRadius:8, padding:'10px 14px',
                    fontSize:13, color:'#1a2332', lineHeight:1.65,
                    whiteSpace:'pre-wrap',
                  }}>
                    {m.content}
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}

            {loading && (
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:5, background:'#f0fdf4', border:'1px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                  <MdPsychology size={15} color="#16a34a"/>
                </div>
                <div style={{ background:'#fff', border:'1px solid #dce4ef', borderRadius:8, padding:'12px 16px' }}>
                  <div className="ai-thinking">
                    <div className="ai-dot"/>
                    <div className="ai-dot"/>
                    <div className="ai-dot"/>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="alert-strip red" style={{fontSize:12}}>
                <MdWarning size={15} style={{flexShrink:0,marginTop:1}}/> {error}
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about traffic in Buea, Douala, Yaoundé or any Cameroon city…"
              className="input"
              style={{ flex:1, borderRadius:6 }}
              disabled={loading}
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()} style={{borderRadius:6,padding:'8px 16px'}}>
              <MdSend size={15}/> Send
            </button>
          </div>
        </div>

        {/* Sidebar: suggestions + context */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, overflowY:'auto' }}>

          {/* Quick questions */}
          <div className="card" style={{padding:0}}>
            <div className="card-header">
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <MdLightbulb size={15} color="#ca8a04"/>
                <span className="section-title" style={{fontSize:13}}>Suggested Questions</span>
              </div>
            </div>
            <div style={{padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} disabled={loading}
                  style={{ textAlign:'left', padding:'7px 10px', borderRadius:5, background:'none', border:'1px solid #e5e7eb', cursor:'pointer', fontSize:12, color:'#374151', lineHeight:1.4, transition:'all 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.borderColor='#bfdbfe'; e.currentTarget.style.color='#1d4ed8' }}
                  onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#374151' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Live context */}
          <div className="card" style={{padding:0}}>
            <div className="card-header">
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <MdBarChart size={15} color="#2563eb"/>
                <span className="section-title" style={{fontSize:13}}>Live Context</span>
              </div>
            </div>
            <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:8}}>
              {[
                { label:'Active Incidents',  value:incidents.filter(i=>i.status!=='Resolved').length, color:'#dc2626', icon:MdWarning },
                { label:'Critical Roads',    value:allRoads.filter(r=>r.congestion==='critical').length, color:'#ea580c', icon:MdDirectionsCar },
                { label:'Sensors Online',    value:`${sensors.filter(s=>s.status==='online').length}/${sensors.length}`, color:'#16a34a', icon:MdPsychology },
                { label:'Buea Roads Tracked',value:allRoads.filter(r=>r.city==='Buea').length, color:'#2563eb', icon:MdDirectionsCar },
              ].map(c => (
                <div key={c.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f3f6fa'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <c.icon size={13} color={c.color}/>
                    <span style={{fontSize:12,color:'#374151'}}>{c.label}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:c.color}}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
