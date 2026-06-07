import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { GROUPS, DEF_PTS } from './data.js'
import Login from './components/Login.jsx'
import MatchCard from './components/MatchCard.jsx'
import Ranking from './components/Ranking.jsx'
import Settings from './components/Settings.jsx'
import styles from './App.module.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('groups')
  const [group, setGroup] = useState('A')
  const [bets, setBets] = useState({})
  const [results, setResults] = useState({})
  const [points, setPoints] = useState(DEF_PTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) loadData()
  }, [user, group])

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const { data } = await supabase.from('config').select('*').eq('key', 'points').single()
    if (data?.value) setPoints(data.value)
  }

  const loadData = async () => {
    setLoading(true)
    const matchIds = GROUPS[group].matches.map(m => m.id)

    const [betsRes, resultsRes] = await Promise.all([
      supabase.from('bets').select('*').eq('user_id', user.id).in('match_id', matchIds),
      supabase.from('results').select('*').in('match_id', matchIds),
    ])

    const betsMap = {}
    betsRes.data?.forEach(b => { betsMap[b.match_id] = b })
    const resultsMap = {}
    resultsRes.data?.forEach(r => { resultsMap[r.match_id] = r })

    setBets(betsMap)
    setResults(resultsMap)
    setLoading(false)
  }

  const allMatches = Object.values(GROUPS).flatMap(g => g.matches)
  const myBetsCount = Object.keys(bets).length

  if (!user) return <Login onLogin={setUser} />

  const navItems = [
    { id: 'groups', label: '⚽ Partidos' },
    { id: 'ranking', label: '🏆 Ranking' },
    ...(user.is_admin ? [{ id: 'settings', label: '⚙️ Config' }] : []),
  ]

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>⚽ MUNDIAL 2026</div>
        <div className={styles.headerRight}>
          {user.is_admin && <span className={styles.adminBadge}>ADMIN</span>}
          <span className={styles.uname}>👤 {user.username}</span>
          <button className={styles.logoutBtn} onClick={() => setUser(null)}>Salir</button>
        </div>
      </header>

      <nav className={styles.nav}>
        {navItems.map(n => (
          <button key={n.id}
            className={`${styles.navBtn} ${tab === n.id ? styles.navActive : ''}`}
            onClick={() => setTab(n.id)}>
            {n.label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {tab === 'groups' && (
          <>
            <div className={styles.groupTabs}>
              {Object.keys(GROUPS).map(g => {
                const hasBets = GROUPS[g].matches.some(m => bets[m.id])
                return (
                  <button key={g}
                    className={`${styles.groupTab} ${group === g ? styles.groupActive : ''}`}
                    onClick={() => setGroup(g)}>
                    Grupo {g}
                    {!user.is_admin && hasBets && <span className={styles.dot} />}
                  </button>
                )
              })}
            </div>
            <div className={styles.groupTeams}>
              {GROUPS[group].teams.map(t => (
                <span key={t} className={styles.teamChip}>{t}</span>
              ))}
            </div>
            {loading ? (
              <div className={styles.loading}>Cargando partidos…</div>
            ) : (
              GROUPS[group].matches.map(m => (
                <MatchCard key={m.id} match={m} user={user}
                  myBet={bets[m.id]} result={results[m.id]}
                  points={points}
                  onBetSaved={loadData} onResultSaved={loadData} />
              ))
            )}
          </>
        )}
        {tab === 'ranking' && <Ranking points={points} />}
        {tab === 'settings' && user.is_admin && (
          <Settings points={points} onPointsSaved={p => { setPoints(p) }} />
        )}
      </main>
    </div>
  )
}
