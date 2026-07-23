// Escudos via jsdelivr + GitHub repo luukhopman/football-logos
// Formato: https://cdn.jsdelivr.net/gh/luukhopman/football-logos@main/logos/ES1/<TeamName>.png

const FILENAMES = {
  'Athletic Club':          'Athletic Club',
  'Atlético de Madrid':     'Atletico Madrid',
  'Celta de Vigo':          'Celta de Vigo',
  'Deportivo de La Coruña': 'Deportivo de La Coruna',
  'Elche':                  'Elche',
  'Espanyol':               'Espanyol',
  'FC Barcelona':           'Barcelona',
  'Getafe':                 'Getafe',
  'Las Palmas':             'Las Palmas',
  'Leganés':                'Leganes',
  'Málaga CF':              'Malaga',
  'Osasuna':                'Osasuna',
  'Racing de Santander':    'Racing Santander',
  'Rayo Vallecano':         'Rayo Vallecano',
  'Real Betis':             'Real Betis',
  'Real Madrid':            'Real Madrid',
  'Real Sociedad':          'Real Sociedad',
  'Sevilla':                'Sevilla',
  'Valencia':               'Valencia',
  'Villarreal':             'Villarreal',
}

function Initials({ team, size }) {
  const words = team.replace(/\bCF\b|\bFC\b/g,'').trim().split(/\s+/)
  const initials = words.slice(0,2).map(w=>w[0]).join('').toUpperCase()
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:'var(--bg3)', border:'1px solid var(--border)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:Math.round(size*0.35), fontWeight:700, color:'var(--accent)',
      flexShrink:0, userSelect:'none',
    }}>{initials}</div>
  )
}

export default function Shield({ team, size=40 }) {
  const file = FILENAMES[team]
  if (!file) return <Initials team={team} size={size} />

  const src = `https://cdn.jsdelivr.net/gh/luukhopman/football-logos@main/logos/ES1/${encodeURIComponent(file)}.png`

  return (
    <img src={src} alt={team} title={team}
      style={{ width:size, height:size, objectFit:'contain', display:'inline-block', flexShrink:0 }}
      onError={e => {
        const div = document.createElement('div')
        const words = team.replace(/\bCF\b|\bFC\b/g,'').trim().split(/\s+/)
        const initials = words.slice(0,2).map(w=>w[0]).join('').toUpperCase()
        Object.assign(div.style, {
          width:size+'px', height:size+'px', borderRadius:'50%',
          background:'var(--bg3)', border:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:Math.round(size*0.35)+'px', fontWeight:'700',
          color:'var(--accent)', flexShrink:'0',
        })
        div.textContent = initials
        e.target.replaceWith(div)
      }}
    />
  )
}
