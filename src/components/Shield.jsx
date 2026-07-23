// Escudos de equipos LaLiga via Wikipedia/commons (sin CORS)
const CRESTS = {
  'Athletic Club': 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_de_Bilbao_logo.svg',
  'Atlético de Madrid': 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  'Celta de Vigo': 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg',
  'Deportivo de La Coruña': 'https://upload.wikimedia.org/wikipedia/en/3/30/RC_Deportivo_de_La_Coru%C3%B1a_logo.svg',
  'Elche': 'https://upload.wikimedia.org/wikipedia/en/4/45/Elche_CF_logo.svg',
  'Espanyol': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/76/RCD_Espanyol_logo.svg/120px-RCD_Espanyol_logo.svg.png',
  'FC Barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  'Getafe': 'https://upload.wikimedia.org/wikipedia/en/3/35/Getafe_CF_logo.svg',
  'Las Palmas': 'https://upload.wikimedia.org/wikipedia/en/5/58/UD_Las_Palmas_logo.svg',
  'Leganés': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/CD_Legan%C3%A9s_logo.svg/120px-CD_Legan%C3%A9s_logo.svg.png',
  'Málaga CF': 'https://upload.wikimedia.org/wikipedia/en/6/6d/Malaga_CF.svg',
  'Osasuna': 'https://upload.wikimedia.org/wikipedia/en/d/d5/CA_Osasuna_logo.svg',
  'Racing de Santander': 'https://upload.wikimedia.org/wikipedia/en/9/9a/Real_Racing_Club_logo.svg',
  'Rayo Vallecano': 'https://upload.wikimedia.org/wikipedia/en/2/27/Rayo_Vallecano_logo.svg',
  'Real Betis': 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg',
  'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  'Real Sociedad': 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg',
  'Sevilla': 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg',
  'Valencia': 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg',
  'Villarreal': 'https://upload.wikimedia.org/wikipedia/en/b/b9/Villarreal_CF_logo-en.svg',
}

export default function Shield({ team, size = 40 }) {
  const src = CRESTS[team]
  if (!src) return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, color: 'var(--text3)' }}>
      ⚽
    </div>
  )
  return (
    <img
      src={src}
      alt={team}
      title={team}
      style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block', flexShrink: 0 }}
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}
