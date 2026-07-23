import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import MatchCard from './MatchCard.jsx'

export default function Jornada({ jornadaId, user, points, isAdmin, onJornadaUpdated }) {
  const [partidos, setPartidos] = useState([])
  const [bets, setBets] = useState({})       // partido_id -> myBet
  const [allBets, setAllBets] = useState({}) // partido_id -> [bets]
  const [allProfiles, setAllProfiles] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [jornada, setJornada] = useState(null)

  useEffect(() => {
    if (jornadaId) load()
  }, [jornadaId, user])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [{ data: jData }, { data: pData }] = await Promise.all([
        supabase.from('liga_jornadas').select('*').eq('id', jornadaId).single(),
        supabase.from('liga_partidos').select('*').eq('jornada_id', jornadaId).order('match_date'),
      ])
      setJornada(jData)
      setPartidos(pData || [])

      if (!pData?.length) { setLoading(false); return }

      const partidoIds = pData.map(p => p.id)

      // Paginated bets
      let allBetsData = []
      let from = 0
      while (true) {
        const { data, error } = await supabase.from('liga_bets').select('*').in('partido_id', partidoIds).range(from, from + 999)
        if (error) throw error
        if (!data || data.length === 0) break
        allBetsData = allBetsData.concat(data)
        if (data.length < 1000) break
        from += 1000
      }

      const [{ data: profilesData }] = await Promise.all([
        supabase.from('profiles').select('id, username, display_name').eq('is_admin', false),
      ])

      const betsMap = {}
      const allBetsMap = {}
      allBetsData.forEach(b => {
        if (b.user_id === user.id) betsMap[b.partido_id] = b
        if (!allBetsMap[b.partido_id]) allBetsMap[b.partido_id] = []
        allBetsMap[b.partido_id].push(b)
      })

      const profilesMap = {}
      profilesData?.forEach(p => { profilesMap[p.id] = p.display_name || p.username })

      setBets(betsMap)
      setAllBets(allBetsMap)
      setAllProfiles(profilesMap)
    } catch (e) {
      setError(e.message || 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  if (!jornadaId) return (
    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>
      No hay jornadas creadas aún.{isAdmin ? ' Crea la primera en Config.' : ''}
    </div>
  )

  if (loading) return <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>Cargando…</div>
  if (error) return <div style={{ color: 'var(--red)', padding: 20 }}>⚠️ {error} <button onClick={load} style={{ marginLeft: 8, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Reintentar</button></div>

  if (partidos.length === 0) return (
    <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>
      {isAdmin ? 'No hay partidos en esta jornada. Añádelos en Config.' : 'Esta jornada no tiene partidos aún.'}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {partidos.map(p => (
        <MatchCard
          key={p.id}
          partido={p}
          user={user}
          myBet={bets[p.id]}
          allBets={allBets[p.id] || []}
          allProfiles={allProfiles}
          points={points}
          isAdmin={isAdmin}
          onSaved={load}
        />
      ))}
    </div>
  )
}
