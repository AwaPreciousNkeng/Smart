import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MdRefresh, MdLocationOn } from 'react-icons/md'
import { sensors, incidents } from '../../data/trafficData'
import { allRoads, cameroonCities, cameroonRegions } from '../../data/cameroonCities'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const mkIcon = (color, size=10) => L.divIcon({
  className:'',
  html:`<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize:[size,size], iconAnchor:[size/2,size/2],
})

const cityIcon = (type) => {
  const sz = type==='metro'||type==='capital' ? 14 : 9
  const bg = type==='metro'?'#2563eb':type==='capital'?'#7c3aed':'#60a5fa'
  return L.divIcon({
    className:'',
    html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${bg};border:2.5px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.25)"></div>`,
    iconSize:[sz,sz], iconAnchor:[sz/2,sz/2],
  })
}

const congColor = { low:'#16a34a', medium:'#ca8a04', high:'#ea580c', critical:'#dc2626' }
const congBadge = { low:'badge-green', medium:'badge-yellow', high:'badge-orange', critical:'badge-red' }

function FlyTo({ city }) {
  const map = useMap()
  useEffect(() => {
    const positions = {
      'All':        { c:[5.5,12.3],   z:6  },
      'Douala':     { c:[4.0511,9.7679],  z:13 },
      'Yaoundé':    { c:[3.8667,11.5167], z:13 },
      'Buea':       { c:[4.1557,9.2432],  z:13 },
      'Limbe':      { c:[4.0165,9.2057],  z:13 },
      'Bamenda':    { c:[5.9631,10.1591], z:12 },
      'Bafoussam':  { c:[5.4766,10.4214], z:12 },
      'Garoua':     { c:[9.3017,13.3965], z:12 },
      'South-West': { c:[4.15,9.28],  z:11 },
    }
    const p = positions[city] || positions['All']
    map.flyTo(p.c, p.z, { duration:1.3 })
  }, [city, map])
  return null
}

export default function LiveTrafficPage() {
  const [city,  setCity]  = useState('All')
  const [layer, setLayer] = useState('all')
  const [time,  setTime]  = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const filterCity = arr => city==='All' ? arr : arr.filter(i=>i.city===city)

  const cityOptions = ['All','Douala','Yaoundé','Buea','Limbe','Bamenda','Bafoussam','Garoua','South-West']
  const layers = [
    {key:'all',      label:'All'},
    {key:'cities',   label:'Cities'},
    {key:'traffic',  label:'Traffic'},
    {key:'incidents',label:'Incidents'},
    {key:'sensors',  label:'Sensors'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <div className="page-title">Live Traffic Monitor</div>
          <div className="page-sub">
            Cameroon national road network · All 10 regions ·{' '}
            <span className="mono" style={{color:'#9ca3af'}}>{time.toLocaleTimeString('en-GB')}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setTime(new Date())}><MdRefresh size={13}/> Refresh</button>
      </div>

      {/* City filter */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
        <span className="label-xs" style={{marginRight:4}}>City:</span>
        {cityOptions.map(c => (
          <button key={c} onClick={()=>setCity(c)}
            className={`btn btn-sm ${city===c?'btn-primary':'btn-ghost'}`}>
            {c==='All'?'🇨🇲 All Cameroon':c}
          </button>
        ))}
      </div>

      {/* Layer filter */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
        <span className="label-xs" style={{marginRight:4}}>Layers:</span>
        {layers.map(l => (
          <button key={l.key} onClick={()=>setLayer(l.key)}
            className={`btn btn-sm ${layer===l.key?'btn-secondary':'btn-ghost'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 270px', gap:14, alignItems:'start' }}>

        {/* Map */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}
          style={{ borderRadius:8, overflow:'hidden', border:'1px solid #dce4ef', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <MapContainer center={[5.5,12.3]} zoom={6} style={{ height:560, width:'100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <FlyTo city={city}/>

            {/* Cities */}
            {(layer==='all'||layer==='cities') && cameroonCities.map(c => (
              <Marker key={c.name} position={[c.lat,c.lng]} icon={cityIcon(c.type)}>
                <Popup>
                  <div style={{fontFamily:'Inter,sans-serif',minWidth:140}}>
                    <div style={{fontWeight:700,fontSize:13,color:'#0f1923',marginBottom:4}}>{c.name}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>Region: {c.region}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>Population: {c.pop}</div>
                    {c.monitored && <div style={{fontSize:11,color:'#15803d',fontWeight:600,marginTop:3}}>✓ SmartRoad Monitored</div>}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Traffic congestion */}
            {(layer==='all'||layer==='traffic') && allRoads.map(r => (
              <Circle key={r.id} center={[r.lat,r.lng]} radius={450}
                pathOptions={{ color:congColor[r.congestion], fillColor:congColor[r.congestion], fillOpacity:0.2, weight:2 }}>
                <Popup>
                  <div style={{fontFamily:'Inter,sans-serif',minWidth:180}}>
                    <div style={{fontWeight:700,fontSize:13,color:'#0f1923',marginBottom:4}}>{r.name}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>City: {r.city} · Region: {r.region}</div>
                    <div style={{fontSize:12,color:'#6b7280',marginTop:2}}>
                      Congestion: <strong style={{color:congColor[r.congestion]}}>{r.congestion}</strong>
                    </div>
                    <div style={{fontSize:12,color:'#6b7280'}}>Density: {r.density}% · Speed: {r.speed} km/h</div>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Sensors */}
            {(layer==='all'||layer==='sensors') && filterCity(sensors).map(s => (
              <Marker key={s.id} position={[s.lat,s.lng]}
                icon={mkIcon(s.status==='online'?'#16a34a':s.status==='fault'?'#ea580c':'#dc2626', 11)}>
                <Popup>
                  <div style={{fontFamily:'Inter,sans-serif'}}>
                    <div style={{fontWeight:700,fontSize:13,color:'#0f1923',marginBottom:3}}>{s.id} · {s.type}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>{s.location}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>
                      Status: <strong style={{color:s.status==='online'?'#15803d':'#b91c1c'}}>{s.status}</strong> · Battery: {s.battery}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Incidents */}
            {(layer==='all'||layer==='incidents') && filterCity(incidents).map(i => (
              <Marker key={i.id} position={[i.lat,i.lng]}
                icon={mkIcon(i.severity==='critical'?'#dc2626':i.severity==='high'?'#ea580c':'#ca8a04', 13)}>
                <Popup>
                  <div style={{fontFamily:'Inter,sans-serif',minWidth:200}}>
                    <div style={{fontWeight:700,fontSize:13,color:'#0f1923',marginBottom:3}}>{i.id} · {i.type}</div>
                    <div style={{fontSize:12,color:'#6b7280'}}>{i.road} · {i.city}</div>
                    <div style={{fontSize:12,color:congColor[i.severity]||'#ca8a04',fontWeight:600,marginTop:2}}>
                      {i.severity} severity · {i.status}
                    </div>
                    <div style={{fontSize:11,color:'#9ca3af',marginTop:3,lineHeight:1.4}}>{i.description?.slice(0,80)}…</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Side panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* Legend */}
          <div className="card" style={{padding:'14px 16px'}}>
            <div className="section-title" style={{marginBottom:12}}>Legend</div>
            <div style={{fontSize:11,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:7}}>Congestion</div>
            {[{l:'Low',c:'#16a34a'},{l:'Medium',c:'#ca8a04'},{l:'High',c:'#ea580c'},{l:'Critical',c:'#dc2626'}].map(x=>(
              <div key={x.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <div style={{width:14,height:7,borderRadius:99,background:x.c,opacity:0.7}}/>
                <span style={{fontSize:12,color:'#374151'}}>{x.l}</span>
              </div>
            ))}
            <div className="divider"/>
            <div style={{fontSize:11,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:7}}>Cities</div>
            {[{l:'Metro city',c:'#2563eb',sz:12},{l:'Capital',c:'#7c3aed',sz:12},{l:'City / Town',c:'#60a5fa',sz:8}].map(x=>(
              <div key={x.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                <div style={{width:x.sz,height:x.sz,borderRadius:'50%',background:x.c,border:'1.5px solid #fff',flexShrink:0,boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}}/>
                <span style={{fontSize:12,color:'#374151'}}>{x.l}</span>
              </div>
            ))}
          </div>

          {/* Road status */}
          <div className="card" style={{padding:0}}>
            <div className="card-header"><div className="section-title">Road Status</div></div>
            <div style={{maxHeight:200,overflowY:'auto'}}>
              {allRoads.filter(r=>city==='All'||r.city===city).slice(0,20).map(r=>(
                <div key={r.id} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 14px',borderBottom:'1px solid #f3f6fa'}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:congColor[r.congestion],flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:'#0f1923',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</div>
                    <div style={{fontSize:10,color:'#9ca3af'}}>{r.city}</div>
                  </div>
                  <span style={{fontSize:11,fontFamily:'JetBrains Mono,monospace',color:'#6b7280',flexShrink:0}}>{r.speed}km/h</span>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Regions */}
          <div className="card" style={{padding:'14px 16px'}}>
            <div className="section-title" style={{marginBottom:10}}>🇨🇲 10 Regions</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
              {cameroonRegions.map(r=>(
                <span key={r} style={{fontSize:11,fontWeight:500,padding:'3px 8px',borderRadius:3,background:'#eff6ff',border:'1px solid #bfdbfe',color:'#1d4ed8'}}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
