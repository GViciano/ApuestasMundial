import { useState } from 'react'
import { supabase } from '../supabase.js'
import { SQUADS, fmtDate, isOpen, timeLeft, calcPoints, calcPointsBreakdown, getSign } from '../data.js'
import Flag from './Flag.jsx'

const s = {
  card:(hasResult)=>({background:'var(--bg2)',border:`1px solid ${hasResult?'var(--border2)':'var(--border)'}`,borderRadius:12,padding:16,marginBottom:10}),
  header:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,gap:8},
  date:{fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:.8},
  badgeTime:{fontSize:12,padding:'3px 8px',borderRadius:20,color:'var(--accent)',background:'rgba(245,166,35,.1)'},
  badgePts:{fontSize:12,padding:'3px 8px',borderRadius:20,color:'var(--green)',background:'rgba(34,197,94,.15)',fontWeight:500},
  badgeZero:{fontSize:12,padding:'3px 8px',borderRadius:20,color:'var(--text3)',background:'rgba(255,255,255,.05)'},
  closed:{fontSize:11,color:'var(--text3)'},
  ptsDetail:{display:'flex',gap:5,fontSize:11,marginTop:3,justifyContent:'flex-end',flexWrap:'wrap'},
  ptsChip:{background:'rgba(34,197,94,.1)',color:'var(--green)',padding:'1px 5px',borderRadius:10},
  teams:{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center',marginBottom:14},
  team:{textAlign:'center'},
  scoreReal:{fontFamily:'var(--font-d)',fontSize:32,color:'var(--accent)',letterSpacing:3},
  vsText:{fontFamily:'var(--font-d)',fontSize:22,color:'var(--text3)'},
  section:{borderTop:'1px solid var(--border)',paddingTop:12,marginTop:4},
  sectionLabel:(accent)=>({fontSize:11,color:accent?'var(--accent)':'var(--text3)',marginBottom:8,textTransform:'uppercase',letterSpacing:.7}),
  scoreInputs:{display:'grid',gridTemplateColumns:'1fr 20px 1fr',gap:8,alignItems:'center',marginBottom:12},
  scoreDash:{textAlign:'center',fontFamily:'var(--font-d)',fontSize:20,color:'var(--text3)'},
  scoreInput:(open)=>({textAlign:'center',background:'var(--bg4)',border:`1px solid ${open?'var(--border2)':'var(--border)'}`,borderRadius:8,padding:'8px 4px',color:'var(--text)',fontSize:22,fontFamily:'var(--font-d)',width:'100%',opacity:open?1:.4}),
  extras:{display:'flex',flexDirection:'column',gap:10,marginBottom:10},
  extraLabel:{fontSize:11,color:'var(--text3)',marginBottom:4},
  sel:(open)=>({background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:7,padding:'8px 10px',color:'var(--text)',fontSize:13,width:'100%',fontFamily:'var(--font-b)',opacity:open?1:.4}),
  minInput:(open)=>({background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:7,padding:'8px 10px',color:'var(--text)',fontSize:13,width:'100%',fontFamily:'var(--font-b)',opacity:open?1:.4}),
  btnPrimary:{width:'100%',padding:9,borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',border:'none',background:'var(--accent)',color:'#0a0f1e'},
  btnSaved:{width:'100%',padding:9,borderRadius:8,fontSize:13,fontWeight:500,cursor:'default',border:'1px solid var(--border)',background:'transparent',color:'var(--text3)'},
  btnSecondary:{width:'100%',padding:9,borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',border:'1px solid var(--border2)',background:'var(--bg4)',color:'var(--text)'},
  btnGhost:{background:'transparent',border:'1px solid var(--border)',borderRadius:7,padding:'5px 12px',fontSize:12,color:'var(--text3)',cursor:'pointer',fontFamily:'var(--font-b)'},
  savedBet:{fontSize:12,color:'var(--text3)',textAlign:'center',padding:'6px 0',lineHeight:1.5},
  noBet:{fontSize:12,color:'var(--text3)',textAlign:'center',padding:'4px 0',fontStyle:'italic'},
}

function signLabel(hg, ag) {
  const sign = getSign(hg, ag)
  if (sign === 'H') return '🏠 Local'
  if (sign === 'A') return '✈️ Visitante'
  return '🤝 Empate'
}

export default function MatchCard({ match, user, myBet, result, allBets, allProfiles, points, onBetSaved, onResultSaved }) {
  const open = isOpen(match.date)
  const tl = timeLeft(match.date)
  const hasResult = result && result.home_goals !== undefined
  const earned = calcPoints(myBet, result, points)
  const breakdown = calcPointsBreakdown(myBet, result, points)
  const homeSquad = SQUADS[match.home] || []
  const awaySquad = SQUADS[match.away] || []

  const [homeG, setHomeG] = useState(myBet?.home_goals ?? '')
  const [awayG, setAwayG] = useState(myBet?.away_goals ?? '')
  const [scorer, setScorer] = useState(myBet?.scorer || '')
  const [minute, setMinute] = useState(myBet?.minute || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showOtherBets, setShowOtherBets] = useState(false)

  const [rHomeG, setRHomeG] = useState(result?.home_goals ?? '')
  const [rAwayG, setRAwayG] = useState(result?.away_goals ?? '')
  const [rScorer, setRScorer] = useState(result?.scorer || '')
  const [rMinute, setRMinute] = useState(result?.minute || '')

  const saveBet = async () => {
    if (homeG === '' || awayG === '') return
    setSaving(true)
    const payload = { user_id:user.id, match_id:match.id, home_goals:+homeG, away_goals:+awayG, scorer:scorer||null, minute:minute?+minute:null }
    if (myBet?.id) await supabase.from('bets').update(payload).eq('id', myBet.id)
    else await supabase.from('bets').insert(payload)
    setSaving(false); setSaved(true)
    setTimeout(()=>setSaved(false), 1500)
    onBetSaved?.()
  }

  const saveResult = async () => {
    if (rHomeG === '' || rAwayG === '') return
    const payload = { match_id:match.id, home_goals:+rHomeG, away_goals:+rAwayG, scorer:rScorer||null, minute:rMinute?+rMinute:null }
    if (result?.id) await supabase.from('results').update(payload).eq('id', result.id)
    else await supabase.from('results').insert(payload)
    onResultSaved?.()
  }

  const PlayerSelect = ({val, onChange, disabled}) => (
    <select value={val} onChange={e=>onChange(e.target.value)} disabled={disabled} style={s.sel(!disabled)}>
      <option value="">— Ninguno / sin goles —</option>
      <optgroup label={`── ${match.home} ──`}>
        {homeSquad.map(p=><option key={p} value={p}>{p}</option>)}
      </optgroup>
      <optgroup label={`── ${match.away} ──`}>
        {awaySquad.map(p=><option key={p} value={p}>{p}</option>)}
      </optgroup>
    </select>
  )

  // Other players' bets — only shown when match is closed
  const otherBets = !open ? (allBets || []).filter(b => b.user_id !== user.id) : []

  return (
    <div style={s.card(hasResult)}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.date}>{fmtDate(match.date)}</span>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3}}>
          {earned !== null ? (
            <>
              <span style={earned>0?s.badgePts:s.badgeZero}>{earned>0?`+${earned} pts`:'0 pts'}</span>
              {earned>0&&breakdown&&(
                <div style={s.ptsDetail}>
                  {breakdown.exact>0&&<span style={s.ptsChip}>🎯+{breakdown.exact}</span>}
                  {breakdown.sign>0&&<span style={s.ptsChip}>✅+{breakdown.sign}</span>}
                  {breakdown.scorer>0&&<span style={s.ptsChip}>⚽+{breakdown.scorer}</span>}
                  {breakdown.minute>0&&<span style={s.ptsChip}>🕐+{breakdown.minute}</span>}
                </div>
              )}
            </>
          ) : tl ? <span style={s.badgeTime}>⏱ {tl}</span>
            : !open && !hasResult ? <span style={s.closed}>Cerrada</span> : null}
        </div>
      </div>

      {/* Teams + score */}
      <div style={s.teams}>
        <div style={s.team}>
          <Flag team={match.home} size={48} style={{borderRadius:4,marginBottom:6}}/>
          <div style={{fontSize:12,fontWeight:500,marginTop:4,lineHeight:1.3}}>{match.home}</div>
        </div>
        <div style={{textAlign:'center',padding:'0 8px'}}>
          {hasResult
            ? <span style={s.scoreReal}>{result.home_goals} - {result.away_goals}</span>
            : <span style={s.vsText}>VS</span>}
        </div>
        <div style={s.team}>
          <Flag team={match.away} size={48} style={{borderRadius:4,marginBottom:6}}/>
          <div style={{fontSize:12,fontWeight:500,marginTop:4,lineHeight:1.3}}>{match.away}</div>
        </div>
      </div>

      {/* Player bet section */}
      {!user.is_admin && (
        <div style={s.section}>
          <div style={s.sectionLabel(false)}>Tu apuesta</div>
          <div style={s.scoreInputs}>
            <input type="number" min="0" max="20" value={homeG} onChange={e=>setHomeG(e.target.value)}
              disabled={!open} placeholder="0" style={s.scoreInput(open)}/>
            <span style={s.scoreDash}>-</span>
            <input type="number" min="0" max="20" value={awayG} onChange={e=>setAwayG(e.target.value)}
              disabled={!open} placeholder="0" style={s.scoreInput(open)}/>
          </div>
          <div style={s.extras}>
            <div>
              <div style={s.extraLabel}>⚽ Primer goleador</div>
              <PlayerSelect val={scorer} onChange={setScorer} disabled={!open}/>
            </div>
            <div>
              <div style={s.extraLabel}>🕐 Minuto primer gol</div>
              <input type="number" min="1" max="120" value={minute} onChange={e=>setMinute(e.target.value)}
                disabled={!open} placeholder="ej: 45" style={s.minInput(open)}/>
            </div>
          </div>
          {open && (
            <button style={saved?s.btnSaved:s.btnPrimary} onClick={saveBet} disabled={saving}>
              {saving?'Guardando…':saved?'✓ Guardada':'Guardar apuesta'}
            </button>
          )}
          {!open && myBet && (
            <div style={s.savedBet}>
              Tu apuesta: <strong>{myBet.home_goals} - {myBet.away_goals}</strong>
              {myBet.scorer&&<span> · ⚽ {myBet.scorer}</span>}
              {myBet.minute&&<span> · 🕐 min {myBet.minute}</span>}
            </div>
          )}
          {!open && !myBet && (
            <div style={s.noBet}>No apostaste en este partido</div>
          )}
        </div>
      )}

      {/* Admin result section */}
      {user.is_admin && (
        <div style={s.section}>
          <div style={s.sectionLabel(true)}>Resultado real</div>
          <div style={s.scoreInputs}>
            <input type="number" min="0" value={rHomeG} onChange={e=>setRHomeG(e.target.value)} placeholder="0" style={s.scoreInput(true)}/>
            <span style={s.scoreDash}>-</span>
            <input type="number" min="0" value={rAwayG} onChange={e=>setRAwayG(e.target.value)} placeholder="0" style={s.scoreInput(true)}/>
          </div>
          <div style={s.extras}>
            <div>
              <div style={s.extraLabel}>⚽ Primer goleador</div>
              <PlayerSelect val={rScorer} onChange={setRScorer} disabled={false}/>
            </div>
            <div>
              <div style={s.extraLabel}>🕐 Minuto primer gol</div>
              <input type="number" min="1" max="120" value={rMinute} onChange={e=>setRMinute(e.target.value)}
                placeholder="min" style={s.minInput(true)}/>
            </div>
          </div>
          <button style={s.btnSecondary} onClick={saveResult}>Guardar resultado</button>
        </div>
      )}

      {/* Other players' bets — visible once match has started */}
      {!open && otherBets.length > 0 && (
        <div style={s.section}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={s.sectionLabel(false)}>Apuestas de todos ({otherBets.length})</div>
            <button style={s.btnGhost} onClick={()=>setShowOtherBets(v=>!v)}>
              {showOtherBets ? 'Ocultar ▲' : 'Ver ▼'}
            </button>
          </div>
          {showOtherBets && (
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {otherBets.map(b => {
                const bd = calcPointsBreakdown(b, result, points)
                const bPts = bd ? bd.exact+bd.sign+bd.scorer+bd.minute : null
                const name = allProfiles[b.user_id] || '?'
                return (
                  <div key={b.user_id} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'center',
                    background:'var(--bg4)',borderRadius:8,padding:'8px 12px',fontSize:13}}>
                    <div>
                      <span style={{fontWeight:500,color:'var(--text2)'}}>{name}</span>
                      <span style={{color:'var(--text3)',marginLeft:10,fontFamily:'var(--font-d)',fontSize:16}}>
                        {b.home_goals} - {b.away_goals}
                      </span>
                      <span style={{color:'var(--text3)',fontSize:11,marginLeft:8}}>{signLabel(b.home_goals,b.away_goals)}</span>
                      {b.scorer && <span style={{color:'var(--text3)',fontSize:11,marginLeft:8}}>⚽ {b.scorer}</span>}
                      {b.minute && <span style={{color:'var(--text3)',fontSize:11,marginLeft:8}}>🕐 min {b.minute}</span>}
                    </div>
                    {bPts !== null && (
                      <span style={{fontSize:12,fontWeight:600,
                        color:bPts>0?'var(--green)':'var(--text3)',
                        background:bPts>0?'rgba(34,197,94,.15)':'rgba(255,255,255,.05)',
                        padding:'2px 8px',borderRadius:20,whiteSpace:'nowrap'}}>
                        {bPts>0?`+${bPts} pts`:'0 pts'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
