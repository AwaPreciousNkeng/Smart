import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdPsychology, MdSend, MdRefresh, MdLightbulb, MdWarning, MdBarChart, MdDirectionsCar } from 'react-icons/md'
import { incidentsAPI, vehiclesAPI } from '../../services/api'

const SUGGESTIONS = [
  'Summarise all active incidents and recommend actions',
  'Which incidents are most critical right now?',
  'What is the breakdown of incidents by severity?',
  'How many vehicles are currently en route?',
  'Which incident types are most common?',
  'Recommend response priorities for current incidents',
  'Are there any flooding or road hazard incidents?',
  'Give me a full traffic situation report for Cameroon',
]

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}

const buildContext = (incidents, vehicles) => {
  const active    = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'CANCELLED')
  const critical  = incidents.filter(i => i.severity === 'CRITICAL')
  const enRoute   = vehicles.filter(v => v.status === 'EN_ROUTE')

  return `You are the AI Traffic Intelligence Assistant for SmartRoad Cameroun — a Smart Traffic and Transport Management System (STTMS) covering all regions of Cameroon.

CURRENT SYSTEM STATE (live data):

Total Incidents: ${incidents.length}
Active (unresolved): ${active.length}
Critical Severity: ${critical.length}
Total Vehicles: ${vehicles.length}
En Route: ${enRoute.length}

Active Incidents (${active.length}):
${active.length === 0 ? '- None' : active.map(i => `- #${i.id}: ${typeLabel[i.type] || i.type} at ${i.locationName || `${i.lat?.toFixed(4)}, ${i.lon?.toFixed(4)}`} — Severity: ${i.severity} — Status: ${i.status}${i.description ? ` — ${i.description.slice(0, 100)}` : ''}`).join('\n')}

Incident Severity Breakdown:
- CRITICAL: ${incidents.filter(i=>i.severity==='CRITICAL').length}
- HIGH: ${incidents.filter(i=>i.severity==='HIGH').length}
- MEDIUM: ${incidents.filter(i=>i.severity==='MEDIUM').length}
- LOW: ${incidents.filter(i=>i.severity==='LOW').length}

Incident Types:
${Object.keys(typeLabel).map(t => `- ${typeLabel[t]}: ${incidents.filter(i=>i.type===t).length}`).join('\n')}

Vehicle Status:
- En Route: ${vehicles.filter(v=>v.status==='EN_ROUTE').length}
- Idle: ${vehicles.filter(v=>v.status==='IDLE').length}
- Out of Service: ${vehicles.filter(v=>v.status==='OUT_OF_SERVICE').length}

You are a helpful, precise and professional traffic management AI. Give practical, actionable recommendations. Be concise but thorough. Format responses clearly using bullet points or numbered steps where appropriate. Always consider road safety, emergency response times and commuter impact.`
}

const callAI = async (messages, context) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY is not configured')

  const chatMessages = [
    { role: 'system', content: context },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `OpenAI API error ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content
    || 'Sorry, I could not generate a response. Please try again.'
}

export default function AIAssistantPage() {
  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [incidents, setIncidents] = useState([])
  const [vehicles,  setVehicles]  = useState([])
  const [dataReady, setDataReady] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    Promise.allSettled([incidentsAPI.getAll(), vehiclesAPI.getAll()]).then(([inc, veh]) => {
      if (inc.status === 'fulfilled') setIncidents(inc.value.data)
      if (veh.status === 'fulfilled') setVehicles(veh.value.data)
      setDataReady(true)
    })
  }, [])

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
      const context = buildContext(incidents, vehicles)
      const reply = await callAI(newMessages, context)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message || 'Failed to connect to AI. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setMessages([]); setInput(''); setError('') }

  const activeInc  = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'CANCELLED')
  const criticalInc= incidents.filter(i => i.severity === 'CRITICAL')

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
              <div className="page-sub">Powered by ChatGPT · Real-time Cameroon traffic intelligence</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ghost btn-sm" onClick={reset} style={{gap:5}}>
            <MdRefresh size={13}/> New Session
          </button>
          <div className="badge-ai" style={{padding:'5px 10px',fontSize:11,display:'flex',alignItems:'center',gap:4}}>
            <MdPsychology size={12}/> ChatGPT
          </div>
        </div>
      </div>

      {!import.meta.env.VITE_OPENAI_API_KEY && (
        <div style={{display:'flex',alignItems:'center',gap:8,background:'#fef3c7',border:'1px solid #fde68a',borderRadius:6,padding:'8px 14px',fontSize:12,color:'#92400e',flexShrink:0}}>
          <MdWarning size={14} style={{flexShrink:0}}/> AI features require <strong>VITE_OPENAI_API_KEY</strong> to be set in your <code>.env</code> file.
        </div>
      )}

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
                    Ask me anything about current incidents, vehicle status, route recommendations or to generate traffic reports for any city in Cameroon.
                    {dataReady && <span style={{display:'block',marginTop:6,color:'#16a34a',fontWeight:600}}>✓ Live data loaded — {incidents.length} incidents, {vehicles.length} vehicles</span>}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <AnimatePresence key={i}>
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  style={{ display:'flex', gap:10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width:28, height:28, borderRadius:5, background: m.role === 'user' ? '#2563eb' : '#f0fdf4', border: m.role === 'assistant' ? '1px solid #bbf7d0' : 'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    {m.role === 'user'
                      ? <span style={{fontSize:12,fontWeight:700,color:'white'}}>U</span>
                      : <MdPsychology size={15} color="#16a34a"/>}
                  </div>
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
              <div style={{display:'flex',alignItems:'flex-start',gap:8,background:'#fef2f2',border:'1px solid #fecaca',borderRadius:6,padding:'10px 14px',fontSize:12,color:'#b91c1c'}}>
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
              placeholder="Ask about current incidents, vehicles or traffic conditions…"
              className="input"
              style={{ flex:1, borderRadius:6 }}
              disabled={loading}
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()} style={{borderRadius:6,padding:'8px 16px'}}>
              <MdSend size={15}/> Send
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, overflowY:'auto' }}>

          {/* Suggestions */}
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
                { label:'Active Incidents',  value: activeInc.length,                            color:'#dc2626', icon:MdWarning },
                { label:'Critical',          value: criticalInc.length,                           color:'#ea580c', icon:MdWarning },
                { label:'Total Vehicles',    value: vehicles.length,                              color:'#2563eb', icon:MdDirectionsCar },
                { label:'En Route',          value: vehicles.filter(v=>v.status==='EN_ROUTE').length, color:'#16a34a', icon:MdDirectionsCar },
              ].map(c => (
                <div key={c.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f3f6fa'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <c.icon size={13} color={c.color}/>
                    <span style={{fontSize:12,color:'#374151'}}>{c.label}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:c.color}}>{dataReady ? c.value : '…'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}