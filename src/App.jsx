import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { DEF_PTS } from './data.js'
import Login from './components/Login.jsx'
import NameModal from './components/NameModal.jsx'
import Jornada from './components/Jornada.jsx'
import Ranking from './components/Ranking.jsx'
import Settings from './components/Settings.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [showNameModal, setShowNameModal] = useState(false)
  const [tab, setTab] = useState('jornada')
  const [menuOpen, setMenuOpen] = useState(false)
  const [points, setPoints] = useState(DEF_PTS)
  const [jornadas, setJornadas] = useState([])
  const [activeJornadaId, setActiveJornadaId] = useState(null)
  const [selectedJornadaId, setSelectedJornadaId] = useState(null)

  useEffect(() => { loadConfig() }, [])
  useEffect(() => { if (user) loadJornadas() }, [user])

  const loadConfig = async () => {
    const { data } = await supabase.from('config').select('*').eq('key', 'liga_points').single()
    if (data?.value) setPoints(data.value)
  }

  const loadJornadas = async () => {
    const { data } = await supabase.from('liga_jornadas').select('*').order('numero')
    if (data) {
      setJornadas(data)
      const active = data.find(j => j.active)
      if (active) {
        setActiveJornadaId(active.id)
        setSelectedJornadaId(prev => prev || active.id)
      } else if (data.length > 0) {
        setSelectedJornadaId(prev => prev || data[data.length - 1].id)
      }
    }
  }

  const handleLogin = async (u) => {
    const normalized = { ...u, is_admin: u.is_admin === true || u.is_admin === 'true' }
    setUser(normalized)
    setDisplayName(normalized.display_name || normalized.username)
    const needsName = !normalized.display_name || normalized.display_name.trim() === ''
    if (needsName && !normalized.is_admin) {
      if (!normalized.username.includes('@')) {
        supabase.from('profiles').update({ display_name: normalized.username }).eq('id', normalized.id)
        setUser({ ...normalized, display_name: normalized.username })
        setDisplayName(normalized.username)
      } else {
        setShowNameModal(true)
      }
    }
  }

  const handleNameSaved = (name) => {
    setDisplayName(name)
    setUser(prev => ({ ...prev, display_name: name }))
    setShowNameModal(false)
  }

  const switchTab = (id) => { setTab(id); setMenuOpen(false) }

  const navItems = [
    { id: 'jornada', label: '⚽ Jornadas' },
    { id: 'ranking', label: '📊 Ranking' },
    ...(user?.is_admin ? [{ id: 'settings', label: '⚙️ Config' }] : []),
  ]

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showNameModal && (
        <NameModal user={user} onSaved={handleNameSaved} onSkip={() => setShowNameModal(false)} />
      )}

      {/* Header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200 }}>
        <button onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
        <div style={{ fontFamily: 'var(--font-d)', fontSize: 20, letterSpacing: 2, color: 'var(--accent)' }}>⚽ LALIGA 26/27</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user.is_admin && <span style={{ fontSize: 11, background: 'rgba(245,166,35,.2)', color: 'var(--accent)', padding: '2px 7px', borderRadius: 4, fontWeight: 500 }}>ADMIN</span>}
          <button onClick={() => { setUser(null); setDisplayName('') }}
            style={{ background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 7, padding: '5px 10px', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-b)' }}>
            Salir
          </button>
        </div>
      </div>

      {/* Drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 190, background: 'rgba(0,0,0,.4)' }}
          onClick={() => setMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 240, height: '100vh', background: 'var(--bg2)', borderRight: '1px solid var(--border)', boxShadow: '4px 0 20px rgba(0,0,0,.3)', display: 'flex', flexDirection: 'column', paddingTop: 58 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '10px 20px', fontSize: 13, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>👤 {displayName}</div>
            {navItems.map(n => (
              <button key={n.id} onClick={() => switchTab(n.id)}
                style={{ padding: '14px 20px', border: 'none', background: tab === n.id ? 'rgba(245,166,35,.1)' : 'transparent', color: tab === n.id ? 'var(--accent)' : 'var(--text)', fontWeight: tab === n.id ? 600 : 400, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-b)', textAlign: 'left', borderLeft: tab === n.id ? '3px solid var(--accent)' : '3px solid transparent', transition: 'all .15s' }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', maxWidth: 800, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Selector de jornada — solo para partidos jugados */}
        {tab === 'jornada' && jornadas.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <select value={selectedJornadaId || ''} onChange={e => setSelectedJornadaId(e.target.value)}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-b)', cursor: 'pointer' }}>
              {jornadas.map(j => (
                <option key={j.id} value={j.id}>
                  {j.label}{j.id === activeJornadaId ? ' ★ Activa' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {tab === 'jornada' && (
          <Jornada
            jornadaId={selectedJornadaId}
            jornadas={jornadas}
            user={user}
            points={points}
            isAdmin={user.is_admin}
            onJornadaUpdated={loadJornadas}
          />
        )}
        {tab === 'ranking' && (
          <Ranking
            points={points}
            currentUser={user}
            jornadas={jornadas}
          />
        )}
        {tab === 'settings' && user.is_admin && (
          <Settings
            points={points}
            currentUser={user}
            jornadas={jornadas}
            activeJornadaId={activeJornadaId}
            onPointsSaved={p => setPoints(p)}
            onJornadaUpdated={loadJornadas}
            onDisplayNameChanged={name => setDisplayName(name)}
          />
        )}
      </div>
    </div>
  )
}
