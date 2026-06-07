import { useState } from 'react'
import { supabase } from '../supabase.js'
import styles from './Login.module.css'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setErr('')
    if (!username.trim() || !password) return setErr('Rellena todos los campos')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username.trim())
          .eq('password_hash', btoa(password))
          .single()
        if (error || !data) { setErr('Usuario o contraseña incorrectos'); setLoading(false); return; }
        onLogin(data)
      } else {
        if (username.trim().length < 3) { setErr('Mínimo 3 caracteres para el usuario'); setLoading(false); return; }
        if (password.length < 4) { setErr('Mínimo 4 caracteres para la contraseña'); setLoading(false); return; }
        const { data: exists } = await supabase.from('profiles').select('id').eq('username', username.trim()).single()
        if (exists) { setErr('Ese nombre de usuario ya está en uso'); setLoading(false); return; }
        const { data, error } = await supabase
          .from('profiles')
          .insert({ username: username.trim(), password_hash: btoa(password), is_admin: false })
          .select()
          .single()
        if (error) { setErr('Error al registrar: ' + error.message); setLoading(false); return; }
        onLogin(data)
      }
    } catch(e) {
      setErr('Error de conexión')
    }
    setLoading(false)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.logo}>
          <div className={styles.big}>MUNDIAL</div>
          <div className={styles.sub}>APUESTAS 2026</div>
        </div>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button className={mode==='login'?styles.active:''} onClick={()=>{setMode('login');setErr('')}}>Entrar</button>
            <button className={mode==='register'?styles.active:''} onClick={()=>{setMode('register');setErr('')}}>Registrarse</button>
          </div>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Usuario</label>
              <input value={username} onChange={e=>setUsername(e.target.value)}
                placeholder="tunombre" onKeyDown={e=>e.key==='Enter'&&handle()} />
            </div>
            <div className={styles.field}>
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••" onKeyDown={e=>e.key==='Enter'&&handle()} />
            </div>
            {err && <div className={styles.err}>{err}</div>}
            <button className={styles.submit} onClick={handle} disabled={loading}>
              {loading ? 'Cargando…' : mode==='login' ? 'Entrar →' : 'Crear cuenta →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
