import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { GROUPS, calcPointsBreakdown } from '../data.js'

export default function Ranking({ points }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const allMatches = Object.values(GROUPS).flatMap(g => g.matches)
    const [{ data: profiles }, { data: bets }, { data: results }] = await Promise.all([
      supabase.from('profiles').select('*').eq('is_admin', false),
      supabase.from('bets').select('*'),
      supabase.from('results').select('*'),
    ])
    const resultsMap = {}
    results?.forEach(r => { resultsMap[r.match_id] = r })

    const scores = (profiles || []).map(u => {
      let total=0, exactPts=0, signPts=0, scorerPts=0, minutePts=0, placed=0
      const userBets = (bets||[]).filter(b => b.user_id===u.id)
      allMatches.forEach(m => {
        const bet = userBets.find(b => b.match_id===m.id)
        if (!bet) return
        placed++
        const bd = calcPointsBreakdown(bet, resultsMap[m.id], points)
        if (!bd) return
        exactPts+=bd.exact; signPts+=bd.sign; scorerPts+=bd.scorer; minutePts+=bd.minute
        total+=bd.exact+bd.sign+bd.scorer+bd.minute
      })
      return { username: u.username, displayName: u.display_name||u.username, total, exactPts, signPts, scorerPts, minutePts, placed }
    }).sort((a,b) => b.total-a.total)

    setScores(scores)
    setLoading(false)
  }

  const medals = ['🥇','🥈','🥉']

  return (
    <div>
      <h2 style={{fontFamily:'var(--font-d)',fontSize:28,letterSpacing:1,marginBottom:20}}>CLASIFICACIÓN</h2>
      {loading ? <div style={{color:'var(--text3)',textAlign:'center',padding:40}}>Cargando…</div>
      : scores.length===0 ? <div style={{color:'var(--text3)',textAlign:'center',padding:40}}>Sin participantes aún</div>
      : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {scores.map((s,i) => (
            <div key={s.username} style={{display:'grid',gridTemplateColumns:'36px 1fr auto',gap:12,alignItems:'center',
              background:i===0?'rgba(245,166,35,.08)':'var(--bg2)',
              border:`1px solid ${i===0?'rgba(245,166,35,.3)':'var(--border)'}`,
              borderRadius:10,padding:'12px 16px'}}>
              <div style={{fontFamily:'var(--font-d)',fontSize:24,color:i<3?'var(--accent)':'var(--text3)',textAlign:'center'}}>
                {i<3?medals[i]:i+1}
              </div>
              <div>
                <div style={{fontWeight:500,fontSize:14}}>{s.displayName}</div>
                <div style={{fontSize:11,color:'var(--text3)',marginTop:3,display:'flex',gap:8,flexWrap:'wrap'}}>
                  <span>🎯 {s.exactPts} exacto</span>
                  <span>✅ {s.signPts} ganador</span>
                  <span>⚽ {s.scorerPts} goleador</span>
                  <span>🕐 {s.minutePts} minuto</span>
                  <span style={{color:'var(--text3)'}}>{s.placed} apuestas</span>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'var(--font-d)',fontSize:30,color:i===0?'var(--accent)':'var(--text)'}}>{s.total}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>pts</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
