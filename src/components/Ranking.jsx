import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { GROUPS, calcPointsBreakdown } from '../data.js'
import styles from './Ranking.module.css'

export default function Ranking({ points }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const allMatches = Object.values(GROUPS).flatMap(g => g.matches)
    const { data: profiles } = await supabase.from('profiles').select('*').eq('is_admin', false)
    const { data: bets } = await supabase.from('bets').select('*')
    const { data: results } = await supabase.from('results').select('*')

    const resultsMap = {}
    results?.forEach(r => { resultsMap[r.match_id] = r })

    const scores = (profiles || []).map(u => {
      let total = 0, exactPts = 0, signPts = 0, scorerPts = 0, minutePts = 0, placed = 0
      const userBets = (bets || []).filter(b => b.user_id === u.id)
      allMatches.forEach(m => {
        const bet = userBets.find(b => b.match_id === m.id)
        const res = resultsMap[m.id]
        if (!bet) return
        placed++
        const bd = calcPointsBreakdown(bet, res, points)
        if (!bd) return
        exactPts += bd.exact; signPts += bd.sign; scorerPts += bd.scorer; minutePts += bd.minute
        total += bd.exact + bd.sign + bd.scorer + bd.minute
      })
      return { username: u.username, total, exactPts, signPts, scorerPts, minutePts, placed }
    }).sort((a, b) => b.total - a.total)

    setScores(scores)
    setLoading(false)
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div>
      <h2 className={styles.title}>CLASIFICACIÓN</h2>
      {loading ? (
        <div className={styles.loading}>Cargando…</div>
      ) : scores.length === 0 ? (
        <div className={styles.empty}>Sin participantes aún</div>
      ) : (
        <div className={styles.list}>
          {scores.map((s, i) => (
            <div key={s.username} className={`${styles.item} ${i === 0 ? styles.first : ''}`}>
              <div className={`${styles.pos} ${i < 3 ? styles.medal : ''}`}>
                {i < 3 ? medals[i] : i + 1}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{s.username}</div>
                <div className={styles.detail}>
                  <span>🎯 {s.exactPts} exacto</span>
                  <span>✅ {s.signPts} ganador</span>
                  <span>⚽ {s.scorerPts} goleador</span>
                  <span>🕐 {s.minutePts} minuto</span>
                  <span className={styles.betCount}>{s.placed} apuestas</span>
                </div>
              </div>
              <div className={styles.pts}>
                <div className={`${styles.ptsNum} ${i === 0 ? styles.ptsGold : ''}`}>{s.total}</div>
                <div className={styles.ptsSub}>pts</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
