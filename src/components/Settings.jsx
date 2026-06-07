import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import styles from './Settings.module.css'

export default function Settings({ points, onPointsSaved }) {
  const [pts, setPts] = useState(points)
  const [saved, setSaved] = useState(false)
  const [users, setUsers] = useState([])
  const [newU, setNewU] = useState('')
  const [newP, setNewP] = useState('')
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_admin', false).order('username')
    setUsers(data || [])
  }

  const savePoints = async () => {
    await supabase.from('config').upsert({ key: 'points', value: pts })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    onPointsSaved(pts)
  }

  const addUser = async () => {
    if (newU.trim().length < 3) return showMsg('Mínimo 3 caracteres para el usuario', false)
    if (newP.length < 4) return showMsg('Mínimo 4 caracteres para la contraseña', false)
    const { data: ex } = await supabase.from('profiles').select('id').eq('username', newU.trim()).single()
    if (ex) return showMsg('Ese usuario ya existe', false)
    await supabase.from('profiles').insert({ username: newU.trim(), password_hash: btoa(newP), is_admin: false })
    setNewU(''); setNewP('')
    showMsg(`✓ Usuario "${newU.trim()}" creado`, true)
    loadUsers()
  }

  const deleteUser = async (id, username) => {
    if (!confirm(`¿Eliminar a ${username}? Se borrarán todas sus apuestas.`)) return
    await supabase.from('bets').delete().eq('user_id', id)
    await supabase.from('profiles').delete().eq('id', id)
    showMsg(`Usuario "${username}" eliminado`, true)
    loadUsers()
  }

  const showMsg = (txt, ok) => { setMsg(txt); setMsgOk(ok) }

  const ptsCriteria = [
    { field: 'exact',  label: '🎯 Resultado exacto (ej: 2-1 exacto)' },
    { field: 'sign',   label: '✅ Ganador / empate correcto (sin importar goles)' },
    { field: 'scorer', label: '⚽ Primer goleador correcto' },
    { field: 'minute', label: '🕐 Minuto primer gol exacto' },
  ]

  return (
    <div>
      <h2 className={styles.title}>CONFIGURACIÓN</h2>

      <div className={styles.section}>
        <h3 className={styles.sh}>Puntos por acierto</h3>
        <p className={styles.note}>Los puntos de "resultado exacto" y "ganador" se suman si se aciertan ambos.</p>
        {ptsCriteria.map(({ field, label }) => (
          <div key={field} className={styles.ptsRow}>
            <span>{label}</span>
            <input type="number" min="0" max="20" className={styles.ptsInput}
              value={pts[field]} onChange={e => setPts({ ...pts, [field]: +e.target.value })} />
          </div>
        ))}
        <button className={`${styles.btn} ${saved ? styles.btnSaved : styles.btnPrimary}`} onClick={savePoints}>
          {saved ? '✓ Guardado' : 'Guardar puntuación'}
        </button>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sh}>Gestión de usuarios</h3>
        <div className={styles.userList}>
          {users.length === 0 && <div className={styles.empty}>Sin usuarios aún</div>}
          {users.map(u => (
            <div key={u.id} className={styles.userRow}>
              <span>👤 {u.username}</span>
              <button className={`${styles.btn} ${styles.btnDanger}`} style={{width:'auto',padding:'5px 12px'}}
                onClick={() => deleteUser(u.id, u.username)}>Eliminar</button>
            </div>
          ))}
        </div>
        <div className={styles.addRow}>
          <input className={styles.inp} placeholder="Nuevo usuario" value={newU} onChange={e=>setNewU(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addUser()} />
          <input className={styles.inp} type="password" placeholder="Contraseña" value={newP} onChange={e=>setNewP(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addUser()} />
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width:'auto'}} onClick={addUser}>Añadir</button>
        </div>
        {msg && <div className={`${styles.msg} ${msgOk ? styles.msgOk : styles.msgErr}`}>{msg}</div>}
      </div>
    </div>
  )
}
