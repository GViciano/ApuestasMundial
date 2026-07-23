// Escudos embebidos como SVG/emoji directamente en el código
// Sin dependencias externas, sin CORS

const SHIELDS = {
  'Athletic Club': (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="48" ry="48" fill="#EE2523"/>
      <rect x="2" y="30" width="28" height="40" fill="#fff"/>
      <rect x="70" y="30" width="28" height="40" fill="#fff"/>
      <rect x="2" y="2" width="96" height="28" rx="10" fill="#EE2523"/>
      <rect x="2" y="70" width="96" height="28" rx="10" fill="#EE2523"/>
      <text x="50" y="62" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#fff" fontFamily="serif">AB</text>
    </svg>
  ),
  'Atlético de Madrid': (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#CB3524"/>
      <rect x="38" y="10" width="24" height="80" fill="#fff"/>
      <rect x="10" y="38" width="80" height="24" fill="#fff"/>
      <text x="50" y="58" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#CB3524" fontFamily="sans-serif">ATM</text>
    </svg>
  ),
}

// Colores por equipo para el fallback visual
const TEAM_COLORS = {
  'Athletic Club':          ['#EE2523','#fff'],
  'Atlético de Madrid':     ['#CB3524','#fff'],
  'Celta de Vigo':          ['#78C5D7','#fff'],
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

// Iniciales representativas
const INITIALS = {
  'Athletic Club':          'ATH',
  'Atlético de Madrid':     'ATM',
  'Celta de Vigo':          'CEL',
  'Deportivo de La Coruña': 'DEP',
  'Elche':                  'ELC',
  'Espanyol':               'ESP',
  'FC Barcelona':           'FCB',
  'Getafe':                 'GET',
  'Las Palmas':             'LPA',
  'Leganés':                'LEG',
  'Málaga CF':              'MAL',
  'Osasuna':                'OSA',
  'Racing de Santander':    'RCD',
  'Rayo Vallecano':         'RAY',
  'Real Betis':             'BET',
  'Real Madrid':            'RMA',
  'Real Sociedad':          'RSO',
  'Sevilla':                'SEV',
  'Valencia':               'VCF',
  'Villarreal':             'VIL',
}

export default function Shield({ team, size = 40 }) {
  const colors = TEAM_COLORS[team] || ['#555','#fff']
  const initials = INITIALS[team] || team.slice(0,3).toUpperCase()
  const [bg, fg] = colors
  const fontSize = size <= 32 ? size * 0.28 : size * 0.25

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      {/* Shield shape */}
      <path d="M50 5 L90 20 L90 55 Q90 80 50 96 Q10 80 10 55 L10 20 Z"
        fill={bg} stroke={fg} strokeWidth="3"/>
      {/* Team initials */}
      <text
        x="50" y="62"
        textAnchor="middle"
        fontSize={fontSize > 22 ? 22 : fontSize < 14 ? 14 : fontSize}
        fontWeight="bold"
        fill={fg}
        fontFamily="Arial, sans-serif"
        letterSpacing="-0.5"
      >{initials}</text>
    </svg>
  )
}
