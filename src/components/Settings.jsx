import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const inp = {background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:8,padding:'9px 12px',color:'var(--text)',fontSize:14,width:'100%',fontFamily:'var(--font-b)'}
const btnP = {background:'var(--accent)',color:'#0a0f1e',fontWeight:500,fontSize:14,padding:'9px 18px',borderRadius:8,cursor:'pointer',border:'none'}
const btnS = {background:'var(--bg4)',color:'var(--text)',fontSize:14,padding:'9px 18px',borderRadius:8,cursor:'pointer',border:'1px solid var(--border2)'}
const btnD = {background:'var(--red)',color:'#fff',fontSize:13,padding:'5px 12px',borderRadius:8,cursor:'pointer',border:'none'}

export default function Settings({ points, currentUser, onPointsSaved, onDisplayNameChanged }) {
  const [pts, setPts] = useState(points)
  const [savedPts, setSavedPts] = useState(false)
  const [users, setUsers] = useState([])
  const [newU, setNewU] = useState('')
  const [newP, setNewP] = useState('')
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)
  // display name (for non-admin)
  const [displayName, setDisplayName] = useState(() => currentUser.display_name || currentUser.username)
  const [dnSaved, setDnSaved] = useState(false)

  useEffect(() => { if (currentUser.is_admin) loadUsers() }, [])

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_admin', false).order('username')
    setUsers(data || [])
  }

  const savePoints = async () => {
    await supabase.from('config').upsert({ key:'points', value:pts })
    setSavedPts(true)
    setTimeout(() => setSavedPts(false), 1500)
    onPointsSaved(pts)
  }

  const saveDisplayName = async () => {
    if (!displayName.trim()) return
    await supabase.from('profiles').update({ display_name: displayName.trim() }).eq('id', currentUser.id)
    setDnSaved(true)
    setTimeout(() => setDnSaved(false), 1500)
    onDisplayNameChanged(displayName.trim())
  }

  const addUser = async () => {
    if (newU.trim().length < 3) return showMsg('Mínimo 3 caracteres', false)
    if (newP.length < 4) return showMsg('Mínimo 4 caracteres para la contraseña', false)
    const { data: ex } = await supabase.from('profiles').select('id').eq('username', newU.trim()).single()
    if (ex) return showMsg('Ese usuario ya existe', false)
    await supabase.from('profiles').insert({ username: newU.trim(), display_name: newU.trim(), password_hash: btoa(newP), is_admin: false })
    setNewU(''); setNewP('')
    showMsg(`✓ Usuario "${newU.trim()}" creado`, true)
    loadUsers()
  }

  const deleteUser = async (id, username) => {
    if (!confirm(`¿Eliminar a ${username}?`)) return
    await supabase.from('bets').delete().eq('user_id', id)
    await supabase.from('profiles').delete().eq('id', id)
    showMsg(`"${username}" eliminado`, true)
    loadUsers()
  }

  const showMsg = (txt, ok) => { setMsg(txt); setMsgOk(ok) }

  const SH = ({children}) => <h3 style={{fontSize:13,color:'var(--text2)',textTransform:'uppercase',letterSpacing:.8,marginBottom:12}}>{children}</h3>
  const Section = ({children}) => <div style={{marginBottom:28,paddingBottom:28,borderBottom:'1px solid var(--border)'}}>{children}</div>

  return (
    <div>
      <h2 style={{fontFamily:'var(--font-d)',fontSize:28,letterSpacing:1,marginBottom:20}}>CONFIGURACIÓN</h2>

      {/* Display name — visible for everyone */}
      <Section>
        <SH>Tu nombre visible</SH>
        <p style={{fontSize:13,color:'var(--text3)',marginBottom:12}}>Este es el nombre que verán los demás en el ranking.</p>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input style={{...inp,flex:1}} value={displayName} onChange={e=>setDisplayName(e.target.value)}
            placeholder="Tu nombre" onKeyDown={e=>e.key==='Enter'&&saveDisplayName()}/>
          <button style={dnSaved?{...btnS,color:'var(--green)'}:btnP} onClick={saveDisplayName}>
            {dnSaved?'✓ Guardado':'Guardar'}
          </button>
        </div>
      </Section>

      {/* Points — admin only */}
      {currentUser.is_admin && (
        <Section>
          <SH>Puntos por acierto</SH>
          <p style={{fontSize:12,color:'var(--text3)',marginBottom:12,fontStyle:'italic'}}>Exacto y ganador se acumulan si se aciertan ambos.</p>
          {[['exact','🎯 Resultado exacto'],['sign','✅ Ganador / empate correcto'],['scorer','⚽ Primer goleador'],['minute','🕐 Minuto primer gol exacto']].map(([f,l])=>(
            <div key={f} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'center',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',marginBottom:8,fontSize:14}}>
              <span>{l}</span>
              <input type="number" min="0" max="20" value={pts[f]} onChange={e=>setPts({...pts,[f]:+e.target.value})}
                style={{width:60,textAlign:'center',background:'var(--bg4)',border:'1px solid var(--border2)',borderRadius:8,padding:8,color:'var(--accent)',fontSize:20,fontFamily:'var(--font-d)'}}/>
            </div>
          ))}
          <button style={savedPts?{...btnS,color:'var(--green)'}:btnP} onClick={savePoints} >
            {savedPts?'✓ Guardado':'Guardar puntuación'}
          </button>
        </Section>
      )}

      {/* User management — admin only */}
      {currentUser.is_admin && (
        <div>
          <SH>Gestión de usuarios</SH>
          <div style={{marginBottom:12}}>
            {users.length===0 && <p style={{fontSize:13,color:'var(--text3)',marginBottom:8}}>Sin usuarios aún</p>}
            {users.map(u=>(
              <div key={u.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 14px',marginBottom:6,fontSize:14}}>
                <div>
                  <span>👤 {u.username}</span>
                  {u.display_name && u.display_name!==u.username && <span style={{color:'var(--text3)',fontSize:12,marginLeft:8}}>({u.display_name})</span>}
                </div>
                <button style={btnD} onClick={()=>deleteUser(u.id,u.username)}>Eliminar</button>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:8,alignItems:'center'}}>
            <input style={inp} placeholder="Nuevo usuario" value={newU} onChange={e=>setNewU(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addUser()}/>
            <input style={inp} type="password" placeholder="Contraseña" value={newP} onChange={e=>setNewP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addUser()}/>
            <button style={btnS} onClick={addUser}>Añadir</button>
          </div>
          {msg && <div style={{fontSize:13,marginTop:8,padding:'7px 10px',borderRadius:6,color:msgOk?'var(--green)':'var(--red)',background:msgOk?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)'}}>{msg}</div>}
        </div>
      )}
    </div>
  )
}
