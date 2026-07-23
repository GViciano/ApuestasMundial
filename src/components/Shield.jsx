import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

// Global cache + one-time load
let cache = null // null = not loaded yet, {} = loaded (possibly empty)
let loadPromise = null

function getLogos() {
  if (cache !== null) return Promise.resolve(cache)
  if (!loadPromise) {
    loadPromise = supabase.from('liga_team_logos').select('team, svg').then(({ data }) => {
      cache = {}
      if (data) data.forEach(r => { cache[r.team] = r.svg })
      return cache
    })
  }
  return loadPromise
}

// Invalidate cache when admin saves a logo
export function invalidateLogoCache() { cache = null; loadPromise = null }

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
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink:0, display:'block' }}>
      <path d="M50 4 L90 20 L90 56 Q90 80 50 96 Q10 80 10 56 L10 20 Z" fill={bg} stroke={fg} strokeWidth="3"/>
      <text x="50" y="63" textAnchor="middle" fontSize="22" fontWeight="bold" fill={fg} fontFamily="Arial,sans-serif" letterSpacing="-0.5">{initials}</text>
    </svg>
  )
}

export default function Shield({ team, size=40 }) {
  const [svg, setSvg] = useState(undefined) // undefined = loading

  useEffect(() => {
    let cancelled = false
    getLogos().then(logos => {
      if (!cancelled) setSvg(logos[team] || null)
    })
    return () => { cancelled = true }
  }, [team])

  // Still loading
  if (svg === undefined) return <div style={{ width:size, height:size, flexShrink:0 }} />

  // No logo in DB — show fallback
  if (!svg) return <Fallback team={team} size={size} />

  // Render SVG from DB, resized to exact dimensions
  return (
    <div style={{
      width: size, height: size, flexShrink: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <div
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{
          __html: svg.replace(
            /<svg([^>]*)>/,
            `<svg$1 width="${size}" height="${size}" style="display:block;max-width:${size}px;max-height:${size}px">`
          )
        }}
      />
    </div>
  )
}
