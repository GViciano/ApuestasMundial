import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

// Cache global para no repetir peticiones
const logoCache = {}
let cacheLoaded = false
const listeners = []

async function ensureCache() {
  if (cacheLoaded) return
  cacheLoaded = true
  const { data } = await supabase.from('liga_team_logos').select('team, svg')
  if (data) data.forEach(r => { logoCache[r.team] = r.svg })
  listeners.forEach(fn => fn())
}

// Fallback con colores oficiales
const COLORS = {
  'Athletic Club':          ['#EE2523','#fff'],
  'Atlético de Madrid':     ['#CB3524','#fff'],
  'Celta de Vigo':          ['#78C5D7','#003DA5'],
  'Deportivo de La Coruña': ['#1B6EC2','#fff'],
  'Elche':                  ['#007A33','#fff'],
  'Espanyol':               ['#00529F','#FFCD00'],
  'FC Barcelona':           ['#A50044','#004D98'],
  'Getafe':                 ['#005BA1','#fff'],
  'Las Palmas':             ['#FFCC00','#005BA1'],
  'Leganés':                ['#1B3D6E','#fff'],
  'Málaga CF':              ['#1D4B9E','#fff'],
  'Osasuna':                ['#D6001C','#000'],
  'Racing de Santander':    ['#007A33','#fff'],
  'Rayo Vallecano':         ['#fff','#E30613'],
  'Real Betis':             ['#007A33','#fff'],
  'Real Madrid':            ['#fff','#00529F'],
  'Real Sociedad':          ['#1565C0','#fff'],
  'Sevilla':                ['#D4151C','#fff'],
  'Valencia':               ['#F7A600','#000'],
  'Villarreal':             ['#FFD700','#000'],
}
const INITIALS = {
  'Athletic Club':'ATH','Atlético de Madrid':'ATM','Celta de Vigo':'CEL',
  'Deportivo de La Coruña':'DEP','Elche':'ELC','Espanyol':'ESP',
  'FC Barcelona':'FCB','Getafe':'GET','Las Palmas':'LPA','Leganés':'LEG',
  'Málaga CF':'MAL','Osasuna':'OSA','Racing de Santander':'RCD',
  'Rayo Vallecano':'RAY','Real Betis':'BET','Real Madrid':'RMA',
  'Real Sociedad':'RSO','Sevilla':'SEV','Valencia':'VCF','Villarreal':'VIL',
}

function Fallback({ team, size }) {
  const [bg, fg] = COLORS[team] || ['#555','#fff']
  const initials = INITIALS[team] || team.slice(0,3).toUpperCase()
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink:0 }}>
      <path d="M50 4 L90 20 L90 56 Q90 80 50 96 Q10 80 10 56 L10 20 Z" fill={bg} stroke={fg} strokeWidth="3"/>
      <text x="50" y="63" textAnchor="middle" fontSize="22" fontWeight="bold" fill={fg} fontFamily="Arial,sans-serif" letterSpacing="-0.5">{initials}</text>
    </svg>
  )
}

export default function Shield({ team, size=40 }) {
  const [svg, setSvg] = useState(logoCache[team] || null)

  useEffect(() => {
    if (logoCache[team] !== undefined) {
      setSvg(logoCache[team])
      return
    }
    // Register listener for when cache loads
    const onLoad = () => setSvg(logoCache[team] || null)
    listeners.push(onLoad)
    ensureCache()
    return () => {
      const i = listeners.indexOf(onLoad)
      if (i >= 0) listeners.splice(i, 1)
    }
  }, [team])

  if (!svg) return <Fallback team={team} size={size} />

  return (
    <div
      style={{ width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
