import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { GROUPS, FLAGS } from '../data.js'
import Flag from './Flag.jsx'

const ALL_TEAMS = Object.keys(FLAGS).sort((a, b) => a.localeCompare(b))

// Deadline: predictions lock when the tournament starts (first match)
const TOURNAMENT_START = new Date('2026-06-11T17:00:00')
const isPredictionOpen = () => new Date() < TOURNAMENT_START

function timeLeftStr() {
  const diff = TOURNAMENT_START - new Date()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const sel = (accent) => ({
  background: 'var(--bg4)', border: `1px solid ${accent ? 'rgba(245,166,35,.4)' : 'var(--border)'}`,
  borderRadius: 8, padding: '8px 10px', color: 'var(--text)',
  fontSize: 13, width: '100%', fontFamily: 'var(--font-b)',
})

export default function Predictions({ user, points }) {
  const [myPredictions, setMyPredictions] = useState({}) // key -> value or [value1, value2]
  const [allPredictions, setAllPredictions] = useState([]) // all users predictions
  const [profiles, setProfiles] = useState({}) // id -> name
  const [saving, setSaving] = useState({})
  const [saved, setSaved] = useState({})
  const [tab, setTab] = useState('groups')
  const open = isPredictionOpen()
  const tl = timeLeftStr()

  useEffect(() => { load() }, [])

  const load = async () => {
    const [myRes, allRes, profRes] = await Promise.all([
      supabase.from('predictions').select('*').eq('user_id', user.id),
      supabase.from('predictions').select('*'),
      supabase.from('profiles').select('id, username, display_name').eq('is_admin', false),
    ])
    // Build myPredictions map
    const map = {}
    myRes.data?.forEach(p => {
      const key = p.prediction_type === 'group_qualifier'
        ? `qualifier_${p.extra}` : p.prediction_type
      if (p.prediction_type === 'group_qualifier') {
        if (!map[key]) map[key] = []
        map[key].push(p.value)
      } else {
        if (!map[key]) map[key] = []
        map[key].push(p.value)
      }
    })
    setMyPredictions(map)
    setAllPredictions(allRes.data || [])
    const pm = {}
    profRes.data?.forEach(p => { pm[p.id] = p.display_name || p.username })
    setProfiles(pm)
  }

  const savePrediction = async (type, extra, values) => {
    const key = type === 'group_qualifier' ? `qualifier_${extra}` : type
    setSaving(s => ({ ...s, [key]: true }))

    // Delete existing then insert new
    let q = supabase.from('predictions').delete().eq('user_id', user.id).eq('prediction_type', type)
    if (extra) q = q.eq('extra', extra)
    await q

    if (values.filter(Boolean).length > 0) {
      const rows = values.filter(Boolean).map(v => ({
        user_id: user.id, prediction_type: type, extra: extra || null, value: v,
      }))
      await supabase.from('predictions').insert(rows)
    }

    setSaving(s => ({ ...s, [key]: false }))
    setSaved(s => ({ ...s, [key]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 1500)
    load()
  }

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setTab(id)} style={{
      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
      fontFamily: 'var(--font-b)', fontWeight: 500, fontSize: 13,
      border: `1px solid ${tab === id ? 'var(--accent)' : 'var(--border)'}`,
      background: tab === id ? 'rgba(245,166,35,.1)' : 'var(--bg2)',
      color: tab === id ? 'var(--accent)' : 'var(--text2)',
    }}>
      {label}
    </button>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 28, letterSpacing: 1 }}>PREDICCIONES</h2>
        {open && tl && (
          <span style={{ fontSize: 12, color: 'var(--accent)', background: 'rgba(245,166,35,.1)', padding: '4px 10px', borderRadius: 20 }}>
            ⏱ Cierra en {tl}
          </span>
        )}
        {!open && (
          <span style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', padding: '4px 10px', borderRadius: 20 }}>
            🔒 Cerradas
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {tabBtn('groups', '🏟 Clasificados')}
        {tabBtn('knockouts', '🏆 Semis / Final')}
        {tabBtn('champion', '👑 Campeón')}
        {tabBtn('ranking', '📊 Ver todas')}
      </div>

      {tab === 'groups' && (
        <GroupQualifiers user={user} open={open} myPredictions={myPredictions}
          saving={saving} saved={saved} onSave={savePrediction} points={points} />
      )}
      {tab === 'knockouts' && (
        <KnockoutPredictions user={user} open={open} myPredictions={myPredictions}
          saving={saving} saved={saved} onSave={savePrediction} points={points} />
      )}
      {tab === 'champion' && (
        <ChampionPrediction user={user} open={open} myPredictions={myPredictions}
          saving={saving} saved={saved} onSave={savePrediction} points={points} />
      )}
      {tab === 'ranking' && (
        <PredictionsRanking allPredictions={allPredictions} profiles={profiles} points={points} />
      )}
    </div>
  )
}

// ── Group Qualifiers ──────────────────────────────────────────────────────────
function GroupQualifiers({ user, open, myPredictions, saving, saved, onSave, points }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
        Elige los 2 equipos que se clasifican de cada grupo. <strong style={{ color: 'var(--accent)' }}>{points.qualifier} pts</strong> por cada clasificado acertado.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(GROUPS).map(([g, { teams }]) => {
          const key = `qualifier_${g}`
          const current = myPredictions[key] || []
          return (
            <GroupQualifierCard key={g} group={g} teams={teams} current={current}
              open={open} saving={saving[key]} saved={saved[key]}
              onSave={(vals) => onSave('group_qualifier', g, vals)} />
          )
        })}
      </div>
    </div>
  )
}

function GroupQualifierCard({ group, teams, current, open, saving, saved, onSave }) {
  const [sel1, setSel1] = useState(current[0] || '')
  const [sel2, setSel2] = useState(current[1] || '')

  // Sync when parent reloads
  useEffect(() => { setSel1(current[0] || ''); setSel2(current[1] || '') }, [current[0], current[1]])

  const isSaved = current.length === 2 && current[0] && current[1]

  return (
    <div style={{
      background: 'var(--bg2)', border: `1px solid ${isSaved ? 'rgba(34,197,94,.3)' : 'var(--border)'}`,
      borderRadius: 12, padding: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--font-d)', fontSize: 16, letterSpacing: 1, color: 'var(--text2)' }}>
          GRUPO {group}
        </div>
        {isSaved && <span style={{ fontSize: 11, color: 'var(--green)', background: 'rgba(34,197,94,.15)', padding: '2px 8px', borderRadius: 20 }}>✓ Guardado</span>}
      </div>

      {/* Teams of the group as reference */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {teams.map(t => (
          <span key={t} style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Flag team={t} size={14} /> {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>1.º clasificado</div>
          <select value={sel1} onChange={e => setSel1(e.target.value)} disabled={!open} style={sel(sel1)}>
            <option value="">— Selecciona —</option>
            {teams.map(t => <option key={t} value={t} disabled={t === sel2}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>2.º clasificado</div>
          <select value={sel2} onChange={e => setSel2(e.target.value)} disabled={!open} style={sel(sel2)}>
            <option value="">— Selecciona —</option>
            {teams.map(t => <option key={t} value={t} disabled={t === sel1}>{t}</option>)}
          </select>
        </div>
      </div>

      {open && (
        <button
          onClick={() => onSave([sel1, sel2])}
          disabled={saving || !sel1 || !sel2}
          style={{
            width: '100%', padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontWeight: 500, fontSize: 13,
            background: saved ? 'transparent' : 'var(--accent)',
            color: saved ? 'var(--text3)' : '#0a0f1e',
            border: saved ? '1px solid var(--border)' : 'none',
            opacity: (!sel1 || !sel2) ? .5 : 1,
          }}>
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
        </button>
      )}
      {!open && isSaved && (
        <div style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', gap: 12 }}>
          <span><Flag team={current[0]} size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{current[0]}</span>
          <span><Flag team={current[1]} size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{current[1]}</span>
        </div>
      )}
      {!open && !isSaved && (
        <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Sin predicción</div>
      )}
    </div>
  )
}

// ── Knockout Predictions ──────────────────────────────────────────────────────
function KnockoutPredictions({ user, open, myPredictions, saving, saved, onSave, points }) {
  const stages = [
    { key: 'semifinal', label: 'Semifinalistas', desc: `Elige los 4 equipos que llegan a semifinales`, count: 4, pts: points.semifinal },
    { key: 'finalist',  label: 'Finalistas',     desc: `Elige los 2 equipos que llegan a la final`, count: 2, pts: points.finalist },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {stages.map(({ key, label, desc, count, pts }) => (
        <MultiTeamCard key={key} stageKey={key} label={label} desc={desc} count={count} pts={pts}
          current={myPredictions[key] || []} open={open}
          saving={saving[key]} saved={saved[key]}
          onSave={(vals) => onSave(key, null, vals)} />
      ))}
    </div>
  )
}

function MultiTeamCard({ stageKey, label, desc, count, pts, current, open, saving, saved, onSave }) {
  const [selections, setSelections] = useState(() => {
    const arr = [...(current || [])]
    while (arr.length < count) arr.push('')
    return arr
  })

  useEffect(() => {
    const arr = [...(current || [])]
    while (arr.length < count) arr.push('')
    setSelections(arr)
  }, [current.join(',')])

  const setAt = (i, val) => {
    const next = [...selections]
    next[i] = val
    setSelections(next)
  }

  const isSaved = current.length === count && current.every(Boolean)
  const isReady = selections.filter(Boolean).length === count && new Set(selections.filter(Boolean)).size === count

  return (
    <div style={{
      background: 'var(--bg2)', border: `1px solid ${isSaved ? 'rgba(34,197,94,.3)' : 'var(--border)'}`,
      borderRadius: 12, padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontFamily: 'var(--font-d)', fontSize: 18, letterSpacing: 1 }}>{label}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--accent)', background: 'rgba(245,166,35,.1)', padding: '2px 8px', borderRadius: 20 }}>
            {pts} pts c/u
          </span>
          {isSaved && <span style={{ fontSize: 11, color: 'var(--green)', background: 'rgba(34,197,94,.15)', padding: '2px 8px', borderRadius: 20 }}>✓ Guardado</span>}
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>{desc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: count === 4 ? '1fr 1fr' : '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {selections.map((val, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Equipo {i + 1}</div>
            <select value={val} onChange={e => setAt(i, e.target.value)} disabled={!open}
              style={sel(val)}>
              <option value="">— Selecciona —</option>
              {ALL_TEAMS.map(t => (
                <option key={t} value={t}
                  disabled={selections.some((s, j) => j !== i && s === t)}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {open && (
        <button onClick={() => onSave(selections)} disabled={saving || !isReady}
          style={{
            width: '100%', padding: 9, borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-b)', fontWeight: 500, fontSize: 13,
            background: saved ? 'transparent' : 'var(--accent)',
            color: saved ? 'var(--text3)' : '#0a0f1e',
            border: saved ? '1px solid var(--border)' : 'none',
            opacity: !isReady ? .5 : 1,
          }}>
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
        </button>
      )}
      {!open && isSaved && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {current.map(t => (
            <span key={t} style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Flag team={t} size={16} /> {t}
            </span>
          ))}
        </div>
      )}
      {!open && !isSaved && (
        <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Sin predicción</div>
      )}
    </div>
  )
}

// ── Champion ──────────────────────────────────────────────────────────────────
function ChampionPrediction({ user, open, myPredictions, saving, saved, onSave, points }) {
  const current = myPredictions['champion']?.[0] || ''
  const [selected, setSelected] = useState(current)
  useEffect(() => setSelected(current), [current])

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
        ¿Quién ganará el Mundial? <strong style={{ color: 'var(--accent)' }}>{points.champion} pts</strong> si aciertas.
      </p>
      <div style={{
        background: 'var(--bg2)', border: `1px solid ${current ? 'rgba(245,166,35,.4)' : 'var(--border)'}`,
        borderRadius: 12, padding: 20, textAlign: 'center',
      }}>
        {current && (
          <div style={{ marginBottom: 16 }}>
            <Flag team={current} size={64} style={{ borderRadius: 6, margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 24, color: 'var(--accent)', letterSpacing: 1 }}>
              {current}
            </div>
            <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>✓ Tu predicción actual</div>
          </div>
        )}
        {open && (
          <>
            <select value={selected} onChange={e => setSelected(e.target.value)}
              style={{ ...sel(selected), maxWidth: 300, marginBottom: 12 }}>
              <option value="">— Elige el campeón —</option>
              {ALL_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <br />
            <button onClick={() => onSave('champion', null, [selected])} disabled={saving['champion'] || !selected}
              style={{
                padding: '10px 28px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-b)', fontWeight: 600, fontSize: 14,
                background: saved['champion'] ? 'transparent' : 'var(--accent)',
                color: saved['champion'] ? 'var(--text3)' : '#0a0f1e',
                border: saved['champion'] ? '1px solid var(--border)' : 'none',
                opacity: !selected ? .5 : 1,
              }}>
              {saving['champion'] ? 'Guardando…' : saved['champion'] ? '✓ Guardado' : '👑 Confirmar campeón'}
            </button>
          </>
        )}
        {!open && !current && (
          <div style={{ fontSize: 13, color: 'var(--text3)', fontStyle: 'italic' }}>Sin predicción del campeón</div>
        )}
      </div>
    </div>
  )
}

// ── Predictions Ranking ───────────────────────────────────────────────────────
function PredictionsRanking({ allPredictions, profiles, points }) {
  // Group by user
  const byUser = {}
  allPredictions.forEach(p => {
    if (!byUser[p.user_id]) byUser[p.user_id] = []
    byUser[p.user_id].push(p)
  })

  const medals = ['🥇', '🥈', '🥉']

  const rows = Object.entries(byUser).map(([userId, preds]) => {
    const name = profiles[userId] || '?'
    const champion = preds.find(p => p.prediction_type === 'champion')?.value
    const finalists = preds.filter(p => p.prediction_type === 'finalist').map(p => p.value)
    const semis = preds.filter(p => p.prediction_type === 'semifinal').map(p => p.value)
    const qualifiers = preds.filter(p => p.prediction_type === 'group_qualifier')
    return { userId, name, champion, finalists, semis, qualifiers }
  }).sort((a, b) => a.name.localeCompare(b.name))

  if (rows.length === 0) {
    return <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>Nadie ha hecho predicciones aún</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((r, i) => (
        <div key={r.userId} style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</div>
            {r.champion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <span style={{ color: 'var(--accent)' }}>👑</span>
                <Flag team={r.champion} size={20} />
                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{r.champion}</span>
              </div>
            )}
          </div>
          {r.finalists.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', marginRight: 8 }}>Final:</span>
              {r.finalists.map(t => (
                <span key={t} style={{ fontSize: 12, color: 'var(--text2)', marginRight: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Flag team={t} size={14} />{t}
                </span>
              ))}
            </div>
          )}
          {r.semis.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', marginRight: 8 }}>Semis:</span>
              {r.semis.map(t => (
                <span key={t} style={{ fontSize: 12, color: 'var(--text2)', marginRight: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Flag team={t} size={14} />{t}
                </span>
              ))}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            Clasificados: {r.qualifiers.length / 2 | 0} grupos completados
          </div>
        </div>
      ))}
    </div>
  )
}

const ALL_TEAMS = Object.keys(FLAGS).sort((a, b) => a.localeCompare(b))
