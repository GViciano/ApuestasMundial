import { useState } from 'react'
import { supabase } from '../supabase.js'
import { FLAGS, SQUADS, fmtDate, isOpen, timeLeft, calcPoints, calcPointsBreakdown } from '../data.js'
import styles from './MatchCard.module.css'

export default function MatchCard({ match, user, myBet, result, points, onBetSaved, onResultSaved }) {
  const open = isOpen(match.date)
  const tl = timeLeft(match.date)
  const hasResult = result && result.home_goals !== undefined

  const [homeG, setHomeG] = useState(myBet?.home_goals ?? '')
  const [awayG, setAwayG] = useState(myBet?.away_goals ?? '')
  const [scorer, setScorer] = useState(myBet?.scorer || '')
  const [minute, setMinute] = useState(myBet?.minute || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [rHomeG, setRHomeG] = useState(result?.home_goals ?? '')
  const [rAwayG, setRAwayG] = useState(result?.away_goals ?? '')
  const [rScorer, setRScorer] = useState(result?.scorer || '')
  const [rMinute, setRMinute] = useState(result?.minute || '')

  const earned = calcPoints(myBet, result, points)
  const breakdown = calcPointsBreakdown(myBet, result, points)

  const homeSquad = SQUADS[match.home] || []
  const awaySquad = SQUADS[match.away] || []

  const saveBet = async () => {
    if (homeG === '' || awayG === '') return
    setSaving(true)
    const payload = {
      user_id: user.id, match_id: match.id,
      home_goals: +homeG, away_goals: +awayG,
      scorer: scorer || null,
      minute: minute ? +minute : null,
    }
    if (myBet?.id) {
      await supabase.from('bets').update(payload).eq('id', myBet.id)
    } else {
      await supabase.from('bets').insert(payload)
    }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    onBetSaved?.()
  }

  const saveResult = async () => {
    if (rHomeG === '' || rAwayG === '') return
    const payload = {
      match_id: match.id,
      home_goals: +rHomeG, away_goals: +rAwayG,
      scorer: rScorer || null,
      minute: rMinute ? +rMinute : null,
    }
    if (result?.id) {
      await supabase.from('results').update(payload).eq('id', result.id)
    } else {
      await supabase.from('results').insert(payload)
    }
    onResultSaved?.()
  }

  return (
    <div className={`${styles.card} ${hasResult ? styles.hasResult : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.date}>{fmtDate(match.date)}</span>
        {earned !== null && (
          <div className={styles.ptsWrap}>
            <span className={`${styles.badge} ${earned > 0 ? styles.badgePts : styles.badgeZero}`}>
              {earned > 0 ? `+${earned} pts` : '0 pts'}
            </span>
            {earned > 0 && breakdown && (
              <div className={styles.ptsDetail}>
                {breakdown.exact > 0 && <span>🎯+{breakdown.exact}</span>}
                {breakdown.sign > 0 && <span>✅+{breakdown.sign}</span>}
                {breakdown.scorer > 0 && <span>⚽+{breakdown.scorer}</span>}
                {breakdown.minute > 0 && <span>🕐+{breakdown.minute}</span>}
              </div>
            )}
          </div>
        )}
        {earned === null && tl && (
          <span className={`${styles.badge} ${styles.badgeTime}`}>⏱ {tl}</span>
        )}
        {earned === null && !tl && !hasResult && (
          <span className={styles.closed}>Cerrada</span>
        )}
      </div>

      {/* Teams */}
      <div className={styles.teams}>
        <div className={styles.team}>
          <div className={styles.flag}>{FLAGS[match.home]}</div>
          <div className={styles.name}>{match.home}</div>
        </div>
        <div className={styles.vs}>
          {hasResult
            ? <span className={styles.scoreReal}>{result.home_goals} - {result.away_goals}</span>
            : <span className={styles.vsText}>VS</span>
          }
        </div>
        <div className={styles.team}>
          <div className={styles.flag}>{FLAGS[match.away]}</div>
          <div className={styles.name}>{match.away}</div>
        </div>
      </div>

      {/* Player bet (non-admin) */}
      {!user.is_admin && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Tu apuesta</div>
          <div className={styles.scoreInputs}>
            <input type="number" min="0" max="20" className={styles.scoreInput}
              value={homeG} onChange={e=>setHomeG(e.target.value)}
              disabled={!open} placeholder="0" />
            <span>-</span>
            <input type="number" min="0" max="20" className={styles.scoreInput}
              value={awayG} onChange={e=>setAwayG(e.target.value)}
              disabled={!open} placeholder="0" />
          </div>

          <div className={styles.extras}>
            <div className={styles.extraField}>
              <div className={styles.extraLabel}>⚽ Primer goleador</div>
              <select className={styles.sel} value={scorer} onChange={e=>setScorer(e.target.value)} disabled={!open}>
                <option value="">— Ninguno / sin goles —</option>
                <optgroup label={`${FLAGS[match.home]} ${match.home}`}>
                  {homeSquad.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
                <optgroup label={`${FLAGS[match.away]} ${match.away}`}>
                  {awaySquad.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className={styles.extraField}>
              <div className={styles.extraLabel}>🕐 Minuto primer gol</div>
              <input type="number" min="1" max="120" className={styles.minInput}
                value={minute} onChange={e=>setMinute(e.target.value)}
                disabled={!open} placeholder="ej: 45" />
            </div>
          </div>

          {open && (
            <button
              className={`${styles.btn} ${saved ? styles.btnSaved : styles.btnPrimary}`}
              onClick={saveBet} disabled={saving}>
              {saving ? 'Guardando…' : saved ? '✓ Guardada' : 'Guardar apuesta'}
            </button>
          )}
          {!open && myBet && (
            <div className={styles.savedBet}>
              Tu apuesta: <strong>{myBet.home_goals} - {myBet.away_goals}</strong>
              {myBet.scorer && <span> · ⚽ {myBet.scorer}</span>}
              {myBet.minute && <span> · 🕐 min {myBet.minute}</span>}
            </div>
          )}
          {!open && !myBet && (
            <div className={styles.noBet}>Sin apuesta registrada</div>
          )}
        </div>
      )}

      {/* Admin result */}
      {user.is_admin && (
        <div className={styles.section}>
          <div className={`${styles.sectionLabel} ${styles.adminLabel}`}>Resultado real</div>
          <div className={styles.scoreInputs}>
            <input type="number" min="0" className={styles.scoreInput}
              value={rHomeG} onChange={e=>setRHomeG(e.target.value)} placeholder="0" />
            <span>-</span>
            <input type="number" min="0" className={styles.scoreInput}
              value={rAwayG} onChange={e=>setRAwayG(e.target.value)} placeholder="0" />
          </div>
          <div className={styles.extras}>
            <div className={styles.extraField}>
              <div className={styles.extraLabel}>⚽ Primer goleador</div>
              <select className={styles.sel} value={rScorer} onChange={e=>setRScorer(e.target.value)}>
                <option value="">— Ninguno / sin goles —</option>
                <optgroup label={`${FLAGS[match.home]} ${match.home}`}>
                  {homeSquad.map(p => <option key={p} value={p}>{p}</option>)}
                </optgroup>
                <optgroup label={`${FLAGS[match.away]} ${match.away}`}>
                  {awaySquad.map(p => <option key={p} value={p}>{p}</option>)}
                </optgroup>
              </select>
            </div>
            <div className={styles.extraField}>
              <div className={styles.extraLabel}>🕐 Minuto primer gol</div>
              <input type="number" min="1" max="120" className={styles.minInput}
                value={rMinute} onChange={e=>setRMinute(e.target.value)} placeholder="min" />
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={saveResult}>
            Guardar resultado
          </button>
        </div>
      )}
    </div>
  )
}
