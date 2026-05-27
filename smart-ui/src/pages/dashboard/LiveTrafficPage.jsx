import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MdRefresh, MdWarning } from 'react-icons/md'
import { incidentsAPI } from '../../services/api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const mkIcon = (color, size = 13) => L.divIcon({
  className: '',
  html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize: [size, size], iconAnchor: [size / 2, size / 2],
})

const sevColor = { LOW:'#16a34a', MEDIUM:'#ca8a04', HIGH:'#ea580c', CRITICAL:'#dc2626' }
const sevBadge = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-orange', CRITICAL:'badge-red' }

const typeLabel = {
  ROAD_ACCIDENT:'Road Accident', VEHICLE_BREAKDOWN:'Breakdown', ROAD_HAZARD:'Road Hazard',
  FLOODING:'Flooding', ROAD_WORKS:'Road Works', FIRE:'Fire', OTHER:'Other',
}

const CITY_VIEWS = {
  'All':       { c:[5.5, 12.3],    z: 6  },
  'Douala':    { c:[4.0511, 9.7679],  z: 13 },
  'Yaoundé':   { c:[3.8667, 11.5167], z: 13 },
  'Buea':      { c:[4.1557, 9.2432],  z: 13 },
  'Limbe':     { c:[4.0165, 9.2057],  z: 13 },
  'Bamenda':   { c:[5.9631, 10.1591], z: 12 },
  'Bafoussam': { c:[5.4766, 10.4214], z: 12 },
  'Garoua':    { c:[9.3017, 13.3965], z: 12 },
}

const CAMEROON_REGIONS = [
  'Adamaoua','Centre','East','Far North','Littoral',
  'North','North-West','South','South-West','West',
]

function FlyTo({ city }) {
  const map = useMap()
  useEffect(() => {
    const p = CITY_VIEWS[city] || CITY_VIEWS['All']
    map.flyTo(p.c, p.z, { duration: 1.3 })
  }, [city, map])
  return null
}

export default function LiveTrafficPage() {
  const [city,      setCity]      = useState('All')
  const [incidents, setIncidents] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [time,      setTime]      = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fetchIncidents = () => {
    setLoading(true)
    incidentsAPI.getAll()
      .then(r => setIncidents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchIncidents() }, [])

  const activeInc = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'CANCELLED')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <div className="page-title">Live Traffic Monitor</div>
          <div className="page-sub">
            Cameroon — real-time incident map ·{' '}
            <span className="mono" style={{ color:'#9ca3af' }}>{time.toLocaleTimeString('en-GB')}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchIncidents}>
          <MdRefresh size={13}/> Refresh
        </button>
      </div>

      {/* City filter */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
        <span className="label-xs" style={{ marginRight:4 }}>City:</span>
        {Object.keys(CITY_VIEWS).map(c => (
          <button key={c} onClick={() => setCity(c)}
            className={`btn btn-sm ${city === c ? 'btn-primary' : 'btn-ghost'}`}>
            {c === 'All' ? '🇨🇲 All Cameroon' : c}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 270px', gap:14, alignItems:'start' }}>

        {/* Map */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }}
          style={{ borderRadius:8, overflow:'hidden', border:'1px solid #dce4ef', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <MapContainer center={[5.5, 12.3]} zoom={6} style={{ height:560, width:'100%' }}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <FlyTo city={city}/>

            {/* Incident markers */}
            {activeInc.map(inc => inc.lat != null && inc.lon != null && (
              <Marker key={inc.id} position={[inc.lat, inc.lon]}
                icon={mkIcon(sevColor[inc.severity] || '#ca8a04')}>
                <Popup>
                  <div style={{ fontFamily:'Inter,sans-serif', minWidth:200 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'#0f1923', marginBottom:3 }}>
                      {typeLabel[inc.type] || inc.type}
                    </div>
                    <div style={{ fontSize:12, color:'#6b7280' }}>{inc.locationName || `${inc.lat?.toFixed(4)}, ${inc.lon?.toFixed(4)}`}</div>
                    <div style={{ fontSize:12, color:sevColor[inc.severity]||'#ca8a04', fontWeight:600, marginTop:2 }}>
                      {inc.severity} · {inc.status}
                    </div>
                    {inc.description && (
                      <div style={{ fontSize:11, color:'#9ca3af', marginTop:3, lineHeight:1.4 }}>
                        {inc.description.slice(0, 90)}{inc.description.length > 90 ? '…' : ''}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Side panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* Legend */}
          <div className="card" style={{ padding:'14px 16px' }}>
            <div className="section-title" style={{ marginBottom:12 }}>Legend</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:7 }}>Incident Severity</div>
            {[{ l:'Critical', c:'#dc2626' },{ l:'High', c:'#ea580c' },{ l:'Medium', c:'#ca8a04' },{ l:'Low', c:'#16a34a' }].map(x => (
              <div key={x.l} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <div style={{ width:12, height:12, borderRadius:'50%', background:x.c, border:'2px solid white', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                <span style={{ fontSize:12, color:'#374151' }}>{x.l}</span>
              </div>
            ))}
          </div>

          {/* Active incidents */}
          <div className="card" style={{ padding:0 }}>
            <div className="card-header">
              <div className="section-title">Active Incidents</div>
              <span style={{ fontSize:11, color:'#6b7280' }}>{activeInc.length} total</span>
            </div>
            <div style={{ maxHeight:260, overflowY:'auto' }}>
              {loading ? (
                <div style={{ padding:'16px', fontSize:12, color:'#9ca3af' }}>Loading…</div>
              ) : activeInc.length === 0 ? (
                <div style={{ padding:'16px', fontSize:12, color:'#9ca3af' }}>No active incidents</div>
              ) : activeInc.map(inc => (
                <div key={inc.id} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 14px', borderBottom:'1px solid #f3f6fa' }}>
                  <MdWarning size={13} color={sevColor[inc.severity] || '#ca8a04'} style={{ marginTop:2, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#0f1923', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {typeLabel[inc.type] || inc.type}
                    </div>
                    <div style={{ fontSize:11, color:'#9ca3af', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {inc.locationName || `${inc.lat?.toFixed(3)}, ${inc.lon?.toFixed(3)}`}
                    </div>
                  </div>
                  <span className={`badge ${sevBadge[inc.severity] || 'badge-blue'}`} style={{ fontSize:9, flexShrink:0 }}>
                    {inc.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Regions */}
          <div className="card" style={{ padding:'14px 16px' }}>
            <div className="section-title" style={{ marginBottom:10 }}>🇨🇲 10 Regions</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {CAMEROON_REGIONS.map(r => (
                <span key={r} style={{ fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:3, background:'#eff6ff', border:'1px solid #bfdbfe', color:'#1d4ed8' }}>
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